class post_film_dto {
  constructor(
    title,
    description,
    release_year,
    length,
    language,
    rental_rate,
    replacement_cost,
    rental_duration,
    categories,
    rating,
    actors,
    special_features
  ) {
    this.title = title;
    this.description = description;
    this.release_year = release_year;
    this.length = length;
    this.language = language;
    this.rental_rate = rental_rate;
    this.replacement_cost = replacement_cost;
    this.rental_duration = rental_duration;
    this.categories = categories;
    this.rating = rating;
    this.actors = actors;
    this.special_features = special_features;
  }
}

export default post_film_dto;
