import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  title: string;
  content: string;
  constructor(private postService: PostsService) { }

  ngOnInit() {
  }
  onAddPost(postForm: NgForm) {
    if (postForm.invalid) {
      console.log(postForm.invalid);
      return;
    }
    // const post: Post = { title: postForm.value.title, content : postForm.value.content};
    // this.emitPost.emit(post);
    this.postService.addPost(postForm.value.title, postForm.value.content);
    postForm.resetForm();
  }

}
