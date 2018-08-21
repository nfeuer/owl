class CreateResources < ActiveRecord::Migration[5.1]
  def change
    create_table :resources do |t|
      t.string :name
      t.string :quantity
      t.string :location
      t.string :status

      t.timestamps
    end
  end
end
