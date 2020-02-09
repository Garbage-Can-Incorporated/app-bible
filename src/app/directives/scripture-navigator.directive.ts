import {
  Directive,
  Input,
  Output,
  ElementRef,
  SimpleChanges,
  OnChanges,
  EventEmitter,
  HostListener
} from '@angular/core';
import { IScriptures } from '../interfaces/i-scriptures';

@Directive({
  selector: '[appScriptureNavigator]'
})
export class ScriptureNavigatorDirective implements OnChanges {
  @Input() public resource: IScriptures;
  @Input() public watch: {
    chapterList: Array<number>;
    bookList: Array<string>;
  };
  @Output() public watchOutput: EventEmitter<object> = new EventEmitter();

  constructor(private el: ElementRef) {}

  ngOnChanges(change: SimpleChanges): void {
    this.coordLeftNavigator();
    this.coordRightNavigator();
  }

  @HostListener('click', ['$event']) onClick(e: Event): void {
    const right = <boolean>(
      this.el.nativeElement.classList.contains('fa-angle-right')
    );

    right ? this.setNextChapter() : this.setPreviousChapter();
  }

  private setPreviousChapter(): void {
    if (this.HOList === false) {
      --this.resource.chapter;
    }

    this.watchOutput.emit(this.resource);
  }

  private setNextChapter(): void {
    if (this.EOList === false) {
      this.resource.chapter += 1;
    }

    this.watchOutput.emit(this.resource);
  }
  private get EOList(): boolean {
    return <number>this.resource.chapter === this.watch.chapterList.length
      ? true
      : false;
  }

  private get HOList(): boolean {
    return <number>this.resource.chapter === 1
      ? true
      : false;
  }

  private setNextBook(): void {
    this.resource.book = this.watch.bookList[this.findCurrentChapter + 1];
  }

  private get findCurrentChapter(): number {
    return this.watch.bookList.findIndex(
      (cur: string) => cur === this.resource.book
    );
  }

  private coordLeftNavigator(): void {
    if (this.resource !== undefined && <number>this.resource.chapter === 1) {
      this.toggleLeftEl(this.el.nativeElement);
      this.toggleRightEl(this.el.nativeElement, false);
    } else if (
      this.resource !== undefined &&
      <number>this.resource.chapter > 1
    ) {
      this.toggleLeftEl(this.el.nativeElement, false);
      this.toggleRightEl(this.el.nativeElement, false);
    }
  }

  private coordRightNavigator (): void {
    if (
      this.resource !== undefined &&
      <number>this.resource.chapter === this.watch.chapterList.length
    ) {
      this.toggleRightEl(this.el.nativeElement);
      this.toggleLeftEl(this.el.nativeElement, false);
    } else if (
      this.resource !== undefined &&
      <number>this.resource.chapter < this.watch.chapterList.length
    ) {
      this.toggleRightEl(this.el.nativeElement, false);
    }
  }

  private toggleLeftEl(el: Element, rem: boolean = true): void {
    if (el.classList.contains('fa-angle-left')) {
      rem ? el.classList.add('d-none') : el.classList.remove('d-none');
    }
  }

  private toggleRightEl(el: Element, rem: boolean = true): void {
    if (el.classList.contains('fa-angle-right')) {
      rem ? el.classList.add('d-none') : el.classList.remove('d-none');
    }
  }
}
