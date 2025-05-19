from django.urls import path
from .views import MovieListView, MovieDetailView, AddToWatchListView
from .views import WatchLogListView, UpdateWatchedEpisodesView
from .views import AddReviewView, UserReviewListView, MovieReviewListView
from .views import ReviewUpdateView, ReviewDeleteView, OneReviewView
from .views import UpdateWatchStatusView

urlpatterns = [
    path('movies/', MovieListView.as_view(), name='movie-list'),
    path('movies/<int:pk>/', MovieDetailView.as_view(), name='movie-detail'),
    path('watchlist/', WatchLogListView.as_view(), name="add-to-watchlist"),
    path('watchlist/add/<int:pk>/',
         AddToWatchListView.as_view(), name="add-to-watchlist"),
    path('watchlist/episodes/<int:pk>/',
         UpdateWatchedEpisodesView.as_view(), name="update-watched-episodes"),
    path('watchlist/status/<int:pk>/',
         UpdateWatchStatusView.as_view(), name="update-watch-status"),
    path('review/add/<int:pk>/',
         AddReviewView.as_view(), name="add-review"),
    path('review/my/',
         UserReviewListView.as_view(), name="get-users-reviews"),
    path('review/my/<int:pk>/',
         OneReviewView.as_view(), name="get-one-users-review"),
    path('review/movie/<int:pk>/',
         MovieReviewListView.as_view(), name="get-movies-reviews"),
    path('review/update/<int:pk>/',
         ReviewUpdateView.as_view(), name="update-review"),
    path('review/delete/<int:pk>/',
         ReviewDeleteView.as_view(), name="delete-review"),
]
