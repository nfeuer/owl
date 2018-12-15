#ifdef MAMA

#include <DNSServer.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include "index.h"

IPAddress apIP(192, 168, 1, 1);
WebServer webServer(80);

DNSServer dnsServer;
const byte DNS_PORT = 53;

/**
   Hotspot/Access Point (🐥 DuckLink 🆘 )
   Local DNS (duck.local)
*/
const char *AP   = " 🆘 EMERGENCY PORTAL";
//const char *AP   = " 🎅DUCK YOU HUMAN";

const char *DNS  = "duck";

String portal = MAIN_page;
String id = "";

/**
   Tracer for debugging purposes
   Toggle (trace = 1) to print statements in Serial
   Toggle (trace = 0) to turn off statements
*/
int trace         = 0;

byte msgCount     = 0;             // count of outgoing messages
int interval      = 2000;          // interval between sends
long lastSendTime = 0;             // time of last packet send

Data victim;

void setup()
{
  Serial.begin(115200);

  setupDisplay();
  setupLoRa();
  setupPortal();

  Serial.println("MAMA Online");
  u8x8.drawString(0, 1, "MAMA Online");
}

///**
//    setupPortal
//    Creates:
//    Hotspot (🐥 DuckLink 🆘 )
//    Captive Portal
//    Local DNS (duck.local)
//*/
void setupPortal()
{
  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));

  WiFi.softAP(AP);
  Serial.println("Created Hotspot");

  dnsServer.start(DNS_PORT, "*", apIP);

  webServer.onNotFound([]()
  {
    webServer.send(200, "text/html", portal);
  });
  webServer.begin();

  if (!MDNS.begin(DNS))
  {
    Serial.println("Error setting up MDNS responder!");
  }
  else
  {
    Serial.println("Created local DNS");
    MDNS.addService("http", "tcp", 80);
  }
}

void loop()
{
  // Handles Captive Portal Requests
  dnsServer.processNextRequest();
  webServer.handleClient();

  // ⚠️ Parses Civilian Requests into Data Structure
  victim = readData();

  if (victim.phone != "")
  {
    sendPayload(victim);
//    showSentData(victim);
  }
  else
  {
    delay(500);
    Serial.print(".");
  }
}

/**
   readyData
   Reads WebServer Parameters and Parses into Data Struct
   @return Parsed Data Struct
*/
Data readData()
{
  Data victim;

  if (id != webServer.arg(2))
  {
    u8x8.clear();
    u8x8.drawString(0, 4, "New Response");

//    for (int i = 0; i < webServer.args(); i++)
//    {
//      Serial.println(webServer.argName(i) + ": " + webServer.arg(i));
//    }

    victim.fname      = webServer.arg(0);
    victim.street     = webServer.arg(1);
    victim.phone      = webServer.arg(2);
    victim.occupants  = webServer.arg(3);
    victim.danger     = webServer.arg(4);
    victim.vacant     = webServer.arg(5);
    victim.firstaid   = webServer.arg(6);
    victim.water      = webServer.arg(7);
    victim.food       = webServer.arg(8);
    victim.msg        = webServer.arg(9);


    u8x8.setCursor(0, 16);
    u8x8.print("Name: " + victim.fname);

    //    Serial.println(victim.id + " " + victim.fname + " " + victim.phone + " " + victim.msg + "\n");
  }
  id = webServer.arg(2);
  return victim;
}

/**
   sendPayload
   Sends Payload (Victim Data Struct as Bytes)
   Shows Sent Data
*/

void sendPayload(Data victim)
{
  LoRa.beginPacket();
  sendMessage(fname_B, victim.fname);
  sendMessage(street_B, victim.street);
  sendMessage(phone_B, victim.phone);
  sendMessage(occupants_B, victim.occupants);

  sendMessage(danger_B, victim.danger);
  sendMessage(vacant_B, victim.vacant);

  sendMessage(firstaid_B, victim.firstaid);
  sendMessage(water_B, victim.water);
  sendMessage(food_B, victim.food);

  sendMessage(msg_B, victim.msg);
  LoRa.endPacket();

  msgCount++;                                   // increment message ID

  delay(5000);
}

void sendMessage(byte byteCode, String outgoing)
{
  LoRa.write(byteCode);               // add byteCode
  LoRa.write(outgoing.length());      // add payload length
  LoRa.print(outgoing);               // add payload

  //   Displays Sent Data on OLED and Serial Monitor
  Serial.println("Parameter: " + outgoing);
}

/**
   showSentData
   Displays Sent Data on OLED and Serial Monitor
*/
//void showSentData(Data victim)
//{
//  //  u8x8.clear();
//  //  u8x8.drawString(0, 0, "Sent:");
//  //  u8x8.setCursor(0, 16);  u8x8.print("Name: "   +  victim.fname );
//  //  u8x8.setCursor(0, 32);  u8x8.print("Phone: "  +  victim.phone );
//  //  u8x8.setCursor(0, 48);  u8x8.print("Mess: "   +  victim.msg   );
//
//  Serial.println("");
//  Serial.println("ID: "      +  victim.id     );
//  Serial.println("Name: "    +  victim.fname );
//  Serial.println("Phone: "   +  victim.phone );
//  Serial.println("Mess: "    +  victim.msg   );
//  Serial.println("");
//}

#endif
