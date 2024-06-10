import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import "quill-mention";

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.page.html',
  styleUrls: ['./add-note.page.scss'],
})
export class AddNotePage implements OnInit {

  @Input() projectId;
  @Input() DATA;

  createNote: FormGroup;
  userId: any;
  note: any = 'update'

  atValues = [
    { id: 1, value: 'Fredrik Sundqvist' },
    { id: 2, value: 'Patrik Sjölin' }
  ];

  hashValues = [
    { id: 3, value: 'Fredrik Sundqvist 2' },
    { id: 4, value: 'Patrik Sjölin 2' }
  ]

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],       
        ['code-block'],
        [{ 'header': 1 }, { 'header': 2 }],              
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }, { 'background': [] }, 'link', 'emoji'],
        [{ 'script': 'sub' }, { 'script': 'super' }],     
        [{ 'indent': '-1' }, { 'indent': '+1' }],          
        [{ 'direction': 'rtl' }],                       

        [{ 'size': ['small', false, 'large', 'huge'] }],  
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean'],                                         

        ['link'],
      ],

    },

    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@", "#"],
      source: (searchTerm, renderList, mentionChar) => {
        let values;

        if (mentionChar === "@") {
          values = this.atValues;
        } else {
          values = this.hashValues;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (var i = 0; i < values.length; i++)
            if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      },
    },
    "emoji-toolbar": false,
    "emoji-textarea": false,
    "emoji-shortname": false,
    keyboard: {
      bindings: {
        shiftEnter: {
          key: 13,
          shiftKey: true,
          handler: (range, context) => {
          }
        },
        enter: {
          key: 13,
          handler: (range, context) => {
            return true;
          }
        }
      }
    }
  }

  constructor(private formBuilder: FormBuilder,
    public modalController: ModalController,
    private commonService: CommonService,
    private router: Router,
    private authService: AuthService,
    private activated: ActivatedRoute,) {

  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');

    this.createNote = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });

    if (this.DATA) {
      this.title.setValue(this.DATA.title);
      this.description.setValue(this.DATA.Description);
    }
  }

  get title() { return this.createNote.get('title') };
  get description() { return this.createNote.get('description') };

  close() {
    this.modalController.dismiss();
  }

  submit() {
    if (this.createNote.invalid) {
      this.commonService.showToast('error', 'Please fill details')
    } else {
      var formdata = {
        title: this.createNote.value.title,
        Description: this.createNote.value.description,
        'employeeID': this.authService.userId,
        'projectId': this.projectId,
        'organisationId': this.authService.organisationId,
      }
      this.commonService.addNote(formdata).then((res: any) => {
        this.commonService.showToast('success', 'Note Added');
        this.close();
      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      })
    }
  }

  updateNote() {
    if (this.createNote.invalid) {
      this.commonService.showToast('error', 'Please fill details')
    } else {
      var formdata = {
        title: this.createNote.value.title,
        Description: this.createNote.value.description,
        'employeeID': this.authService.userId,
        'projectId': this.projectId,
        'organisationId': this.authService.organisationId,
        'NoteId': this.DATA.NoteId
      }
      this.commonService.updateNote(formdata).then((res: any) => {
        this.commonService.showToast('success', 'Note Added');
        this.close();
      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      })
    }
  }

}
