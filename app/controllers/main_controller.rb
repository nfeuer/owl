class MainController < ApplicationController

  #################### Web Pages

  def index
  end

  def home
    @message = Message.new
  end


  ##################### Twilio commands SMS Texting and Phone Calls

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

  end

  def tts

  	@endpoint = "https://stream.watsonplatform.net/text-to-speech/api"

  end

  def translate

	{
	  "apikey": "bUXEp_-PgAvYlYBxLjjUFb1Z-suQfdSw3h2bpSsMNcG_",
	  "iam_apikey_description": "Auto generated apikey during resource-key operation for Instance - crn:v1:bluemix:public:language-translator:us-south:a/a05e0398b87df931aa0f181fc49d23ee:466ff35e-5f99-4ab4-862c-e8203daee5b2::",
	  "iam_apikey_name": "auto-generated-apikey-621c31ed-7ff1-4f73-a5e9-3b4180ef0d69",
	  "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
	  "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/a05e0398b87df931aa0f181fc49d23ee::serviceid:ServiceId-87a8b3ec-e5c9-44f9-a9cc-ce27e4bc6028",
	  "url": "https://gateway.watsonplatform.net/language-translator/api"
	}

  end

end
