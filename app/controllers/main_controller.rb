class MainController < ApplicationController

  #################### Web Pages

  def index
    render layout: "landing"
  end

  def home
    if signed_in?
      @message = Message.new
    else
      redirect_to "/"
    end
  end

  def search
    @us = []

    User.all.order(username: :asc).each_with_index do |f, index|
      @el = {
        value: f.username,
        label: f.name.to_s.capitalize,
        id: f.id
      }

      @us.push(@el)
    end
    @us = @us.to_json

    @newmessage = Message.new
  end

  def weather
    
  end




  ##################### DATABASE API ROUTES TO PUSH AND PULL DATA



  ###### set user main incident

  def setuserincident

    @uid = params[:user]
    @iid = params[:incident]

    @u = User.find(@uid)
    @u.incident = @iid
    @u.save
    
  end


  ###### messaging API to get messages, set messages as read, etc.

  def getusername
    @u = params[:id]
    @username = User.find(@u).username
    respond_to do |format|
      format.text { render plain: @username }
    end
  end
  
  def getdirectmessages
    @u1 = params[:sender]
    @u2 = params[:recipient]
    @messages = []
    Message.where("sender = ? AND recipient = ?", @u1.to_i, @u2.to_i).order(created_at: :desc).each do |f|
      @m = [f.sender, f.message, f.created_at.to_i]
      @messages.push(@m)
    end
    Message.where("sender = ? AND recipient = ?", @u2.to_i, @u1.to_i).order(created_at: :desc).each do |f|
      @m = [f.sender, f.message, f.created_at.to_i]
      @messages.push(@m)
    end
    @messages = @messages.sort {|a,b| a[2] <=> b[2]}
    respond_to do |format|
      # format.html { redirect_to "/", notice: 'Gene created.' }
      format.js { render action: 'getdirectmessages' }
    end
  end

  def setmessageread

    # get message from API request
    @m = params[:mid]

    # find details about this message, like sender and recipient
    @message = Message.find(@m)
    @r = @message.recipient
    @s = @message.sender

    # set all messages in these two users' thread to "read=true" because maybe several were unread
    @fullthreadmessages = Message.where("sender = ? AND recipient = ?", @s, @r)
    @fullthreadmessages.each do |f|
      f.read = true
      f.save
    end

  end

  ######### Create random users

  def createuser
    @username = params[:username]
    @name = params[:name]

    @u = User.create(username: @username, name: @name, password: "password", password_digest: "password")
    @u.save
  end






  ######################## Twilio commands SMS Texting and Phone Calls

  def sendtext

	@account_sid = "AC6e6e9ff5e49ee5759341cee47f95e568"
	@auth_token = "a15edbeb573ac2c6cc6bad635063bdc8"
	@client = Twilio::REST::Client.new @account_sid, @auth_token
	if params[:message].blank?
		@message = 'Hi there, this is OWL.'
	else
		@message = params[:message]
	end

	@client.messages.create(
		:from => '+14847256467',
		:to => '+14843472216',
		:body => @message
	)

  end

  def sendcall

	@account_sid = "AC6e6e9ff5e49ee5759341cee47f95e568"
	@auth_token = "a15edbeb573ac2c6cc6bad635063bdc8"
	@client = Twilio::REST::Client.new @account_sid, @auth_token

	@client.calls.create(
		:from => '+14847256467',
		:to => '+16175847593',
		method: "GET",
	    url: "http://s3.amazonaws.com/responsivetech/assets/call.xml"
	)
  end




  ###################### IBM WATSON API INTELLIGENCE COMMANDS

  def analyzetone

  	##### IBM Watson Tone Analyzer

  	@text = params[:text]
  	@endpoint = "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?text=" + @text + "&version=2017-09-21&sentences=true"
    @tone = HTTParty.get(@endpoint, headers: { Authorization: "Basic ZmMxYjY3YTYtZTJmMi00YWVhLTgzMTYtZjBjYzMwMDRlY2MyOkhNMHhWT2NDWmxsWg==", 'Content-type' => 'application/x-www-form-urlencoded' }, body: { })
    @tone = @tone

    respond_to do |format|
      # format.html { redirect_to "/", notice: 'Gene created.' }
    	format.js { render action: 'tone' }
    end
  end

  def visualizer

    ##### IBM Watson Visual Recognition API

    # @imgurl = params[:url]
    @imgurl = "https://s3.amazonaws.com/responsivetech/assets/bmd02.jpg"
    # @imgurl = "https://s3.amazonaws.com/responsivetech/assets/dogtest02.jpg"

    # @endpoint = "https://gateway.watsonplatform.net/visual-recognition/api/v3/classify?version=2016-05-17&classifier_ids=DefaultCustomModel_2101976&url=" + @imgurl
    @endpoint = "https://gateway.watsonplatform.net/visual-recognition/api/v3/classify?version=2016-05-17&url=" + @imgurl
    
    @auth = {:username => "apikey", :password => "KUEQEGANZJS0gU4rnD_q0N99Va8KI2QtEQ21lOH9ycsf"}
    @visual = HTTParty.get(@endpoint, basic_auth: @auth, body: { })
    @vjson = JSON.parse(@visual.to_json)
    @images = @vjson['images']
    @classifiers = @images.to_a[0]['classifiers']
    @classes = @classifiers[0]['classes']

    puts " "
    puts "----- visualizer"
    puts @vjson
    puts " "
    puts "----- images"
    puts @images
    puts " "
    puts "----- classifiers"
    puts @classifiers
    puts " "
    puts "----- classes"
    puts @classes

      respond_to do |format|
        # format.html { redirect_to "/", notice: 'Gene created.' }
        format.js { render action: 'visual' }
      end
  end

  def classifier

  	##### IBM Watson Natural Language Classifier allowing us to create custom voice text models

  	@text = params[:text]
  	@text = "how hot will it be outside today?"

  	{
  	  "url": "https://gateway.watsonplatform.net/natural-language-classifier/api",
  	  "username": "e8f3ecb4-979e-45c1-8939-bdd29b9d7474",
  	  "password": "7h6goCtngjoN"
  	}

  	@endpoint = "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/10D41B-nlc-1/classify?text=" + @text
  end

  def nlu

  	##### IBM Watson Natural Language Understanding Base models for text

  	# @text = params[:text]
  	@text = "IBM is an American multinational technology company headquartered in Armonk, New York, United States, with operations in over 170 countries."

  	# @features = "concepts,categories,emotion,entities,keywords,metadata,relations,semantic_roles,sentiment"
  	@features = "keywords,entities"

  	@endpoint = "https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2018-03-16&features=" + @features + "&text=" + @text
  	@nlu = HTTParty.get(@endpoint, headers: { Authorization: 'Basic NGJhODRmYWQtN2E0NC00ZTg3LTkwYTgtM2ZkZGEyYmI0OGJhOnRERDNEdTU4QVhIMw==', 'Content-type' => 'application/json' }, body: {})

  	puts " "
  	puts "----- nlu"
  	puts @nlu

  end

  def stt
    # @text = params[:text]
    # if @text.to_s == ""
    #   @text = "hello world!"
    # end

    # require 'net/http'
    # require 'uri'
    # require 'json'

    # uri = URI.parse("https://gateway.watsonplatform.net/language-translator/api/v3/translate?version=2018-05-01")
    # request = Net::HTTP::Post.new(uri)
    # request.basic_auth("apikey", "bUXEp_-PgAvYlYBxLjjUFb1Z-suQfdSw3h2bpSsMNcG_")
    # request.content_type = "application/json"
    # request.body = JSON.dump({
    #   "text" => [
    #     @text
    #   ],
    #   "model_id" => "en-es"
    # })

    # req_options = {
    #   use_ssl: uri.scheme == "https",
    # }

    # @response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
    #   http.request(request)
    # end
    
    # respond_to do |format|
    #   format.text { render plain: @response.body }
    # end
  end

  def tts
  	@endpoint = "https://stream.watsonplatform.net/text-to-speech/api"
  end

  def translator

    ###### this is the translator page
    translatelanguages

  end

  def translate

    ###### this is the translate text API route

    @text = params[:text]
    if @text.to_s == ""
      @text = "hello world!"
    end
    
    @startlang = params[:startlang]
    if @startlang.to_s == ""
      @startlang = "en"
    end

    @targetlang = params[:targetlang]
    if @targetlang.to_s == ""
      @targetlang = "es"
    end

    @model = @startlang + "-" + @targetlang

    require 'net/http'
    require 'uri'
    require 'json'

    uri = URI.parse("https://gateway.watsonplatform.net/language-translator/api/v3/translate?version=2018-05-01")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth("apikey", "bUXEp_-PgAvYlYBxLjjUFb1Z-suQfdSw3h2bpSsMNcG_")
    request.content_type = "application/json"
    request.body = JSON.dump({
      "text" => [
        @text
      ],
      "model_id" => @model
    })

    req_options = {
      use_ssl: uri.scheme == "https",
    }

    @response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end

    puts " "
    puts "----translator"
    puts " model"
    puts @model
    puts @response.body
    puts " "
    puts @response
    
    respond_to do |format|
      format.text { render plain: @response.body }
    end
  end

  def identifylanguage

    @text = params[:text]
    if @text.to_s == ""
      @text = "hello world!"
    end

    require 'net/http'
    require 'uri'

    uri = URI.parse("https://gateway.watsonplatform.net/language-translator/api/v3/identify?version=2018-05-01")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth("apikey", "bUXEp_-PgAvYlYBxLjjUFb1Z-suQfdSw3h2bpSsMNcG_")
    request.content_type = "text/plain"
    request.body = @text

    req_options = {
      use_ssl: uri.scheme == "https",
    }

    @response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end

    # puts " "
    # puts "----translator"
    # puts @response.body
    # puts " "
    # puts @response
    
    respond_to do |format|
      format.text { render plain: @response.body }
    end
  end

  def translatelanguages
    
    require 'net/http'
    require 'uri'

    uri = URI.parse("https://gateway.watsonplatform.net/language-translator/api/v3/identifiable_languages?version=2018-05-01")
    request = Net::HTTP::Get.new(uri)
    request.basic_auth("apikey", "bUXEp_-PgAvYlYBxLjjUFb1Z-suQfdSw3h2bpSsMNcG_")
    request.content_type = "text/plain"

    req_options = {
      use_ssl: uri.scheme == "https",
    }

    @response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end

    # puts " "
    # puts "---- get translate languages"
    # puts @response.body
    # puts " "
    # puts @response
    
    # respond_to do |format|
    #   format.text { render plain: @response.body }
    # end
  end






  ############### The weather company weather api data routes

  def getweatheralerts

    @geoid = params[:geoid]

    if @geoid.to_s == ""
      @geoid = "PAC113"
    end

    require 'uri'
    require 'net/http'

    url = URI("https://api.weather.com/v2/stormreports?apiKey=320c9252a6e642f38c9252a6e682f3c6&geoId=" + @geoid + "&format=json")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Get.new(url)
    request["accept-encoding"] = 'application/gzip'
    request["content-type"] = 'application/json'
    request["cache-control"] = 'no-cache'
    request["postman-token"] = 'f9989c6b-3f90-7ca9-6dd1-cae7a4140e04'

    @response = http.request(request)
    # puts " "
    # puts "----- weather alerts"
    # puts @response.read_body

    respond_to do |format|
      format.text { render plain: @response.body }
    end

  end


  def getweatherforecast

    @geocode = ""

    require 'uri'
    require 'net/http'

    url = URI("https://api.weather.com/v3/wx/forecast/daily/3day?apiKey=320c9252a6e642f38c9252a6e682f3c6&language=en-US&units=e%0A&format=json&geocode=34.063%2C-84.217")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Get.new(url)
    request["accept-encoding"] = 'application/gzip'
    request["content-type"] = 'application/json'
    request["cache-control"] = 'no-cache'
    request["postman-token"] = 'bc80387e-19bc-cade-06bc-0cae662b5a41'

    @response = http.request(request)
    # puts " "
    # puts "----- weather forecast"
    # puts @response.read_body

    respond_to do |format|
      format.text { render plain: @response.body }
    end
  end



end
