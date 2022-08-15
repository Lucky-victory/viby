import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  getToken() :string{
    return ''
  }
  get currentUser() {
    return {
      user_id: '1',
      profile_picture: 'https://images.pexels.com/photos/8916199/pexels-photo-8916199.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
      cover_image:'https://images.pexels.com/photos/13075368/pexels-photo-13075368.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
      fullname: 'Lucky Victory',
      username:'lucky_v'
    }
  }
}
