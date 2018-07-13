class MainController < ApplicationController
  def index
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

  def call

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


end
