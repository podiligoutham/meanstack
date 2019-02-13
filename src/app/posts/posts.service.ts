import { Injectable } from '@angular/core';
import { Post } from '../post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  posts: Post[] = [];
  private postSubject = new Subject<Post[]>();

  constructor(private http: HttpClient) { }
  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
    .subscribe((postsData) => {
      this.posts = postsData.posts;
      this.postSubject.next(this.posts);
    });
  }

  getUpdatedPosts() {
    return this.postSubject.asObservable();
  }

  addPost(title: string, content: string) {
    const post = { id: null, title, content};
    this.http.post('http://localhost:3000/api/posts', post)
    .subscribe((data) => {
    console.log(data);
    this.posts.push(post);
    this.postSubject.next(this.posts);

    });
  }
}
