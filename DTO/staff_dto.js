class staff_dto {
  constructor(id, first_name, last_name, email, picture, isActive) {
    this.staff_id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.picture = picture;
    this.isActive = isActive;
  }
}

export { staff_dto };
