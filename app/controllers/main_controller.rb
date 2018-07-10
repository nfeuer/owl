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
end
