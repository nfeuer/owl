class ResourcesController < ApplicationController

  def index
    @user = current_user
    @resource = Resource.new
    @resources = Resource.all
  end

  def show
    @resource = Resource.find(params[:id])
  end

  def new
    @resource = Resource.new
  end

  def edit
  end

  def create
    @resource = Resource.new(resource_params)

    respond_to do |format|
      if @resource.save
        format.html { redirect_to "/resources", notice: 'resource created.' }
        format.json { render action: 'show', status: :created, location: @resource }
      else
        format.html { render action: 'new' }
        format.json { render json: @resource.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @resource = Resource.find(params[:id])
    respond_to do |format|
      if @resource.update(resource_params)
        format.html { redirect_to @resource, notice: 'resource was successfully updated.' }
        format.json { render :show, status: :ok, location: @resource }
      else
        format.html { redirect_to @resource }
        format.json { render json: @resource.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @resource = resource.find(params[:id])
    @resource.destroy
    respond_to do |format|
      format.html { redirect_to "/resources", notice: 'resource was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    def resource_params
      params.require(:resource).permit(:name, :quantity, :location)
    end
end