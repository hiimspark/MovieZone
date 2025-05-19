from rest_framework import serializers
from .models import MovieOrSeries, WatchLog, Review


class MovieShortSerializer(serializers.ModelSerializer):
    poster = serializers.SerializerMethodField()
    class Meta:
        model = MovieOrSeries
        fields = ['id', 'title', 'short_description',
                  'critic_rating', 'poster']
    
    def get_poster(self, obj):
        if obj.poster:
            return "/media/" + obj.poster.name
        return None


class MovieDetailSerializer(serializers.ModelSerializer):
    user_rating = serializers.SerializerMethodField()
    total_episodes = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    poster = serializers.SerializerMethodField()
    trailer = serializers.SerializerMethodField()


    class Meta:
        model = MovieOrSeries
        exclude = ['short_description']

    def get_user_rating(self, obj):
        return obj.user_rating

    def get_total_episodes(self, obj):
        return obj.total_episodes

    def get_reviews(self, obj):
        reviews = Review.objects.filter(
            watch_log__movie_or_series=obj).order_by('-created_at')
        return ReviewSerializer(reviews, many=True).data

    def get_poster(self, obj):
        if obj.poster:
            return "/media/" + obj.poster.name
        return None

    def get_trailer(self, obj):
        if obj.trailer:
            return "/media" + obj.trailer.name
        return None


class WatchLogSerializer(serializers.ModelSerializer):
    movie_or_series_title = serializers.CharField(
        source='movie_or_series.title', read_only=True)
    movie_or_series_poster = serializers.SerializerMethodField()
    has_review = serializers.SerializerMethodField()
    review = serializers.SerializerMethodField()

    def get_has_review(self, obj):
        return Review.objects.filter(
            user=obj.user,
            watch_log__movie_or_series=obj.movie_or_series).exists()

    def get_review(self, obj):
        review = Review.objects.filter(
            user=obj.user,
            watch_log__movie_or_series=obj.movie_or_series).first()
        return ReviewSerializer(review).data

    def get_movie_or_series_poster(self, obj):
        poster = obj.movie_or_series.poster
        if poster:
            return "/media/" + poster.name
        return None

    class Meta:
        model = WatchLog
        fields = ['id', 'user', 'movie_or_series', 'movie_or_series_title',
                  'movie_or_series_poster', 'has_review', 'total_episodes',
                  'watched_episodes', 'status', 'review']


class ReviewSerializer(serializers.ModelSerializer):
    movie_or_series = serializers.CharField(
        source='watch_log.movie_or_series', read_only=True)
    movie_title = serializers.CharField(
        source='watch_log.movie_or_series.title', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'username', 'movie_title',
                  'movie_or_series', 'rating', 'content',
                  'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
