class staff_member_dto {
  constructor({
    name,
    email,
    phone,
    live_country,
    live_city,
    live_address,
    store_country,
    store_city,
    store_address,
    is_active,
    profile_picture,
  }) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.live_country = live_country;
    this.live_city = live_city;
    this.live_address = live_address;
    this.store_country = store_country;
    this.store_city = store_city;
    this.store_address = store_address;
    this.is_active = is_active;
    this.profile_picture = profile_picture;
  }
}

export default staff_member_dto;
