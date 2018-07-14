class CreateMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :messages do |t|
      t.integer :sender
      t.integer :recipient
      t.text :message
      t.string :file
      t.boolean :read
      t.string :mtype

      t.timestamps
    end
  end
end
