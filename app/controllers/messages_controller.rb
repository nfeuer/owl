class MessagesController < ApplicationController

  def index
    @user = current_user
    @message = Message.new
    @messages = Message.where("sender = ? OR recipient = ?", @user.id, @user.id).order(created_at: :desc)
  end

  def show
  end

  def new
    @message = Message.new
  end

  def edit
  end

  def create
    @message = Message.new(message_params)

    respond_to do |format|
      if @message.save
        format.html { redirect_to "/messages", notice: 'Message created.' }
        format.json { render action: 'show', status: :created, location: @message }
      else
        format.html { render action: 'new' }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @message.update(message_params)
        format.html { redirect_to @message, notice: 'Message was successfully updated.' }
        format.json { render :show, status: :ok, location: @message }
      else
        format.html { redirect_to @message }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @message = Message.find(params[:id])
    @message.destroy
    respond_to do |format|
      format.html { redirect_to "/messages", notice: 'Message was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    def message_params
      params.require(:message).permit(:sender, :recipient, :message, :file, :read, :mtype)
    end
end
