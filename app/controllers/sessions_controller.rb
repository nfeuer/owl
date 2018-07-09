class SessionsController < ApplicationController
    def new
    	if signed_in?
    		sign_out
    		redirect_to '/'
	    else
	    	
	    end
    end
 
	def create
		user = User.find_by(username: params[:session][:username].downcase)
	    if user && user.authenticate(params[:session][:password])
			sign_in user
			flash[:notice] = "Welcome back " + user.username + "!"
			redirect_to "/"
	    else
	      flash[:error] = 'Invalid email/password combination'
	      redirect_to "/signin"
	    end
	end

	def destroy
		sign_out
		flash[:success] = "See you again soon!"
		redirect_to "/"
	end
end
