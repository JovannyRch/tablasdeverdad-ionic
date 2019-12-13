import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositorioPage } from './repositorio.page';

describe('RepositorioPage', () => {
  let component: RepositorioPage;
  let fixture: ComponentFixture<RepositorioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepositorioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositorioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
