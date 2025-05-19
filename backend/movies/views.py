from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MovieOrSeries, WatchLog, WatchStatus, Review
from .serializers import MovieShortSerializer, MovieDetailSerializer
from .serializers import WatchLogSerializer, ReviewSerializer


class MovieListView(generics.ListAPIView):
    queryset = MovieOrSeries.objects.all()
    serializer_class = MovieShortSerializer


class MovieDetailView(generics.RetrieveAPIView):
    queryset = MovieOrSeries.objects.all()
    serializer_class = MovieDetailSerializer


class AddToWatchListView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        try:
            movie = MovieOrSeries.objects.get(pk=pk)
        except MovieOrSeries.DoesNotExist:
            return Response({"error": "Фильм или сериал не найден."},
                            status=status.HTTP_404_NOT_FOUND)

        if WatchLog.objects.filter(user=user, movie_or_series=movie).exists():
            return Response({"error": "Этот фильм уже "
                            "добавлен в ваш дневник."},
                            status=status.HTTP_400_BAD_REQUEST)

        total_episodes = movie.total_episodes

        WatchLog.objects.create(
            user=user,
            movie_or_series=movie,
            total_episodes=total_episodes,
            watched_episodes=0,
            status='planned'
        )

        return Response({"success": "Фильм/сериал успешно"
                        " добавлен в дневник."},
                        status=status.HTTP_201_CREATED)


class WatchLogListView(generics.ListAPIView):
    serializer_class = WatchLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WatchLog.objects.filter(user=self.request.user)


class UpdateWatchedEpisodesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        direction = request.data.get('direction')

        if direction is None:
            return Response({"error": "Поле "
                            "'direction' обязательно."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            watch_log = WatchLog.objects.get(pk=pk, user=user)
        except WatchLog.DoesNotExist:
            return Response({"error": "Элемент дневника "
                            " не найден."}, status=status.HTTP_404_NOT_FOUND)

        if direction is True:
            if watch_log.watched_episodes < watch_log.total_episodes:
                watch_log.watched_episodes += 1
            else:
                return Response({"error": "Все серии уже просмотрены."},
                                status=status.HTTP_400_BAD_REQUEST)
        elif direction is False:
            if watch_log.watched_episodes > 0:
                watch_log.watched_episodes -= 1
            else:
                return Response({"error": "Количество просмотренных серий"
                                " не может быть меньше нуля."},
                                status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Поле 'direction' "
                            " должно быть true или false."},
                            status=status.HTTP_400_BAD_REQUEST)

        watch_log.save()
        return Response({"success": "Количество просмотренных"
                        " серий обновлено.", "watched_episodes":
                                    watch_log.watched_episodes})


class UpdateWatchStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        new_status = request.data.get('status')

        if new_status not in WatchStatus.values:
            return Response({"error": "Недопустимый статус просмотра."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            watch_log = WatchLog.objects.get(pk=pk, user=user)
        except WatchLog.DoesNotExist:
            return Response({"error": "Элемент дневника не найден."},
                            status=status.HTTP_404_NOT_FOUND)

        watch_log.status = new_status
        watch_log.save()

        return Response({"success": "Статус просмотра обновлён.",
                         "new_status": watch_log.status})


class AddReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        try:
            watchlog_entry = WatchLog.objects.get(pk=pk, user=user)
        except watchlog_entry.DoesNotExist:
            return Response({"error": "Фильм или сериал не"
                            " найден в дневнике."},
                            status=status.HTTP_404_NOT_FOUND)

        if Review.objects.filter(user=user, watch_log=watchlog_entry).exists():
            return Response({"error": "Отзыв на этот элемент уже написан."},
                            status=status.HTTP_400_BAD_REQUEST)

        Review.objects.create(
            user=user,
            watch_log=watchlog_entry,
            rating=request.data.get('rating'),
            content=request.data.get('content')
        )

        return Response({"success": "Отзыв успешно написан."},
                        status=status.HTTP_201_CREATED)


class UserReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)


class OneReviewView(generics.RetrieveAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)


class MovieReviewListView(APIView):
    serializer_class = ReviewSerializer

    def get(self, request, pk):
        try:
            movie = MovieOrSeries.objects.get(pk=pk)
        except MovieOrSeries.DoesNotExist:
            return Response({"error": "Фильм или сериал не найден."},
                            status=status.HTTP_404_NOT_FOUND)

        reviews = Review.objects.filter(watch_log__movie_or_series=movie)
        serializer = ReviewSerializer(reviews, many=True)

        return Response(serializer.data)


class ReviewUpdateView(APIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user = request.user
        try:
            review = Review.objects.get(user=user, pk=pk)
        except Review.DoesNotExist:
            return Response({"error": "Отзыв не найден."},
                            status=status.HTTP_404_NOT_FOUND)

        review.rating = request.data.get('rating', review.rating)
        review.content = request.data.get('content', review.content)
        review.save()

        return Response({"success": "Отзыв успешно изменен."},
                        status=status.HTTP_200_OK)


class ReviewDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        user = request.user
        try:
            review = Review.objects.get(user=user, pk=pk)
        except Review.DoesNotExist:
            return Response({"error": "Отзыв не найден."},
                            status=status.HTTP_404_NOT_FOUND)

        review.delete()
        return Response({"success": "Отзыв успешно удалён."},
                        status=status.HTTP_204_NO_CONTENT)
