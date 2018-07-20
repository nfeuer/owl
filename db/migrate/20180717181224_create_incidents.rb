class CreateIncidents < ActiveRecord::Migration[5.1]
  def change
    create_table :incidents do |t|
      t.string :name
      t.string :location
      t.string :managers
      t.integer :impacted
      t.integer :casualties

      t.timestamps
    end
  end
end
