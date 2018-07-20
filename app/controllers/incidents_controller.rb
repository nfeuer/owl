class IncidentsController < ApplicationController

  def index
    @user = current_user
    @incident = Incident.new
    @incidents = Incident.all
  end

  def show
  end

  def new
    @incident = Incident.new
  end

  def edit
  end

  def create
    @incident = Incident.new(incident_params)

    respond_to do |format|
      if @incident.save
        format.html { redirect_to "/incidents", notice: 'Incident created.' }
        format.json { render action: 'show', status: :created, location: @incident }
      else
        format.html { render action: 'new' }
        format.json { render json: @incident.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @incident.update(incident_params)
        format.html { redirect_to @incident, notice: 'Incident was successfully updated.' }
        format.json { render :show, status: :ok, location: @incident }
      else
        format.html { redirect_to @incident }
        format.json { render json: @incident.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @incident = incident.find(params[:id])
    @incident.destroy
    respond_to do |format|
      format.html { redirect_to "/incidents", notice: 'incident was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    def incident_params
      params.require(:incident).permit(:name, :location, :managers, :impacted, :casualties)
    end
end