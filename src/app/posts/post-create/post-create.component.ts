import { Subscription } from 'rxjs';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from 'src/app/post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  title: string;
  content: string;
  private authSub: Subscription;
  private mode = 'create';
  private postID: string;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview;
  isAuthenticated = false;
  constructor(private postService: PostsService, private authService: AuthService,
              private snackBar: MatSnackBar, private route: ActivatedRoute) { }

  ngOnInit() {
    this.authSub = this.authService.getAuthStatus().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.isAuthenticated = this.authService.getIsAuth();
    this.authService.getAuthStatus().subscribe((status) => {
      this.isAuthenticated = status;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postid')) {
        this.mode = 'edit';
        this.postID = paramMap.get('postid');
        //
        this.isLoading = true;
        this.postService.getPost(this.postID).subscribe(postData => {
          this.post = { id: postData.id, title: postData.title, content: postData.content, imagePath: postData.imagePath,
                      creator: postData.creator};
          //
          this.isLoading = false;
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postID = null;

      }
    });
  }

  onImageAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onAddPost() {
    this.isLoading = true;
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
  } else {
    this.postService.updatePost(this.postID, this.form.value.title, this.form.value.content,  this.form.value.image);
  }
    this.form.reset();
    this.snackBar.open('posted successfully', 'Undo', {
      duration: 2000,
      });
  }
  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}
