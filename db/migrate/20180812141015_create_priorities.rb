class CreatePriorities < ActiveRecord::Migration[5.1]
  def change
    create_table :priorities do |t|
      t.string :name
      t.string :level
      t.text :details
      t.integer :incident_id

      t.timestamps
    end
  end
end
