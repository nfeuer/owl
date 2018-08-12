class PrioritiesController < ApplicationController

  def index
  	@priorities = Priority.all
  	@newpriority = Priority.new
  end

  def show
  end

  def new
    @priority = Priority.new
  end

  def edit
  end

  def create
    @priority = Priority.new(priority_params)

    respond_to do |format|
      if @priority.save
        format.html { redirect_to "/priorities", notice: 'Priority created.' }
        format.json { render action: 'show', status: :created, location: @priority }
      else
        format.html { render action: 'new' }
        format.json { render json: @priority.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @priority.update(priority_params)
        format.html { redirect_to @priority, notice: 'Priority was successfully updated.' }
        format.json { render :show, status: :ok, location: @priority }
      else
        format.html { redirect_to @priority }
        format.json { render json: @priority.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @priority = Priority.find(params[:id])
    @priority.destroy
    respond_to do |format|
      format.html { redirect_to "/prioritys", notice: 'priority was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    def priority_params
      params.require(:priority).permit(:name, :details, :level, :incident_id)
    end
end
