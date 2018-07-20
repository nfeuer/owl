Rails.application.routes.draw do

  get 'main/index'
  root 'main#index'

  # dynamic resources
  resources :messages
  resources :incidents
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

  # custom html pages
  match '/home', to: 'main#home', via: 'get'
  match '/eye', to: 'main#eye', via: 'get'
  match '/test', to: 'main#test', via: 'get'
  match '/search', to: 'main#search', via: 'get'
  match '/translator', to: 'main#translator', via: 'get'

  
  ########## API ROUTES

  # rails database api routes
  match '/getusername', to: 'main#getusername', via: 'get'
  match '/getdirectmessages', to: 'main#getdirectmessages', via: 'get'
  match '/setmessageread', to: 'main#setmessageread', via: 'get'
  match '/createuser', to: 'main#createuser', via: 'get'

  # Twilio API routes
  match '/sendtext', to: 'main#sendtext', via: 'get'
  match '/sendcall', to: 'main#sendcall', via: 'get'

  # IBM Watson API Routes
  match '/analyzetone', to: 'main#analyzetone', via: 'get'
  match '/visualizer', to: 'main#visualizer', via: 'get'
  match '/nlu', to: 'main#nlu', via: 'get'
  match '/translate', to: 'main#translate', via: 'get'
  match '/identifylanguage', to: 'main#identifylanguage', via: 'get'
  
end
