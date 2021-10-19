import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],
  animations: [
    trigger('itemAnim', [
      transition('void=>*', [
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
        }),
        animate(
          '50ms',
          style({
            height: '*',
            'margin-bottom': '*',
            paddingTop: '*',
            paddingRight: '*',
            paddingLeft: '*',
            paddingBottom: '*',
          })
        ),
        animate(200),
      ]),
      transition('*=> void', [
        animate(
          50,
          style({
            transform: 'scale(1.05)',
          })
        ),
        animate(
          50,
          style({
            transform: 'scale(1)',
            opacity: 0.75,
          })
        ),
        animate(
          '120ms ease-out',
          style({
            transform: 'scale(0.68)',
            opacity: 0,
          })
        ),
        animate(
          '150ms ease-out',
          style({
            height: 0,
            'margin-bottom': 0,
            paddingTop: 0,
            paddingRight: 0,
            paddingLeft: 0,
            paddingBottom: 0,
          })
        ),
      ]),
    ]),

    trigger('listAnim', [
      transition('*=>*', [
        query(
          ':enter',
          [
            style({
              opacity: 0,
              height: 0,
            }),
            stagger(100, [animate('0.2s ease')]),
          ],
          {
            optional: true,
          }
        ),
      ]),
    ]),
  ],
})
export class NotesListComponent implements OnInit {
  notes: Note[] = new Array<Note>();
  filterdNotes: Note[] = new Array<Note>();
  constructor(private notesService: NotesService) {}

  ngOnInit() {
    this.notes = this.notesService.getAll();
    this.filterdNotes = this.notes;
  }

  deleteNote(id: number) {
    this.notesService.delete(id);
  }

  filter(query: string) {
    query = query.toLowerCase().trim();
    let allResults: Note[] = new Array<Note>();
    let terms: string[] = query.split(' ');
    terms = this.removeDuplicates(terms);
    terms.forEach((term) => {
      let results: Note[] = this.relevantNotes(term);
      allResults = [...allResults, ...results];
    });
    let uniqueResults = this.removeDuplicates(allResults);
    this.filterdNotes = uniqueResults;
  }

  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    arr.forEach((e) => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }
  relevantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter((note) => {
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    });
    return relevantNotes;
  }
}
