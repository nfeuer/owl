class ClusterdatasController < ApplicationController

  def index
    @clusterdatas = Clusterdatum.all
  end

  def show
    @clusterdata = Clusterdatum.find(params[:id])
  end

  def new
    @clusterdata = Clusterdatum.new
  end

  def edit
  end

  def create
    @clusterdata = Clusterdatum.new(clusterdata_params)

    respond_to do |format|
      if @clusterdata.save
        format.html { redirect_to "/clusterdatas", notice: 'clusterdata created.' }
        format.json { render action: 'show', status: :created, location: @clusterdata }
      else
        format.html { render action: 'new' }
        format.json { render json: @clusterdata.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @clusterdata = Clusterdatum.find(params[:id])
    respond_to do |format|
      if @clusterdata.update(clusterdata_params)
        format.html { redirect_to @clusterdata, notice: 'clusterdata was successfully updated.' }
        format.json { render :show, status: :ok, location: @clusterdata }
      else
        format.html { redirect_to @clusterdata }
        format.json { render json: @clusterdata.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @clusterdata = Clusterdatum.find(params[:id])
    @clusterdata.destroy
    respond_to do |format|
      format.html { redirect_to "/clusterdatas", notice: 'clusterdata was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    def clusterdata_params
      params.require(:clusterdata).permit(:content)
    end
end