Rails.application.routes.draw do

  get 'main/index'
  root 'main#index'

  resources :users
  resources :sessions, only: [:new, :create, :destroy]


  #####   set custom routes for the application   ######

  # users, login related custom routes
  get "sessions/new"
  get "sessions/destroy"
  get 'sessions/new'
  match '/signin', to: 'sessions#new', via: 'get'
  match '/signout', to: 'sessions#destroy', via: 'delete'
  match '/signup', to: 'users#new', via: 'get'
  
end
