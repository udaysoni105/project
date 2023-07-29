import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserchecktableComponent } from './userchecktable.component';

describe('UserchecktableComponent', () => {
  let component: UserchecktableComponent;
  let fixture: ComponentFixture<UserchecktableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserchecktableComponent]
    });
    fixture = TestBed.createComponent(UserchecktableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
