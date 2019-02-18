import { Injectable } from '@angular/core';
import { Post } from '../post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { stringify } from '@angular/core/src/util';
import { Router } from '@angular/router';
import { post } from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  posts: Post[] = [];
  private postSubject = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }
  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts').pipe( map(postData => {
      return postData.posts.map(post => {
        return{
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
        };
      });
    } ) )
    .subscribe((postsData) => {
      this.posts = postsData;
      this.postSubject.next(this.posts);
    });
  }

  getUpdatedPosts() {
    return this.postSubject.asObservable();
  }

  addPost(title: string, content: string, image: File ) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string , post: Post}>('http://localhost:3000/api/posts', postData)
    .subscribe((res) => {
    const post: Post = {
      id: res.post.id,
      title,
      content,
      imagePath: res.post.imagePath
    };
    this.posts.push(post);
    this.postSubject.next(this.posts);
    this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id' , id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
       postData = {id, title, content, imagePath: image};
    }
    this.http.put('http://localhost:3000/api/posts/' + id , postData )
    .subscribe((res) => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex( p => p.id === id);
      console.log(res);
      const post: Post = {
        id,
        title,
        content,
        imagePath: res.imagePath
      };
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postSubject.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    this.http.delete('http://localhost:3000/api/posts/' + id)
    .subscribe((res) => {
      const updatedPosts = this.posts.filter(post => post.id !== id);
      this.posts = updatedPosts ;
      this.postSubject.next(this.posts);
      console.log(res);
    });
  }
// 6869B  5116  5016
  getPost(id: string) {
    return this.http.get<{id: string, title: string, content: string, imagePath: string}> ('http://localhost:3000/api/posts/' + id);
  }

}
