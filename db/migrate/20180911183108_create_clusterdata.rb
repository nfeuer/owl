class CreateClusterdata < ActiveRecord::Migration[5.1]
  def change
    create_table :clusterdata do |t|
      t.text :content

      t.timestamps
    end
  end
end
