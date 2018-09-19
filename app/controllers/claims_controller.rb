class ClaimsController < ApplicationController

  def index
    @claims = Claim.all
  end

  def show
    @claim = Claim.find(params[:id])
  end

  def new
    @claim = Claim.new
  end

  def edit
  end

  def create
    @claim = Claim.new(claim_params)

    respond_to do |format|
      if @claim.save
        format.html { redirect_to "/claims", notice: 'claim created.' }
        format.json { render action: 'show', status: :created, location: @claim }
      else
        format.html { render action: 'new' }
        format.json { render json: @claim.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @claim = Claim.find(params[:id])
    respond_to do |format|
      if @claim.update(claim_params)
        format.html { redirect_to @claim, notice: 'claim was successfully updated.' }
        format.json { render :show, status: :ok, location: @claim }
      else
        format.html { redirect_to @claim }
        format.json { render json: @claim.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @claim = Claim.find(params[:id])
    @claim.destroy
    respond_to do |format|
      format.html { redirect_to "/claims", notice: 'claim was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    def claim_params
      params.require(:claim).permit(:file, :description)
    end
end