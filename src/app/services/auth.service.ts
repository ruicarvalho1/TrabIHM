/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatform } from '@ionic/angular';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUser: BehaviorSubject<User | boolean | null> =
    new BehaviorSubject<User | boolean | null>(null);

  constructor(private router: Router) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.supabase.auth.onAuthStateChange((event: any, sess: any) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('SET USER');

        this.currentUser.next(sess?.user ?? null);
      } else {
        this.currentUser.next(false);
      }
    });

    // Trigger initial session load
    this.loadUser();
  }

  async loadUser() {
    if (this.currentUser.value) {
      // User is already set, no need to do anything else
      return;
    }
    const user = await this.supabase.auth.getUser();

    if (user.data.user) {
      this.currentUser.next(user.data.user);
    } else {
      this.currentUser.next(false);
    }
  }

  signUp(credentials: { email: string; password: string }) {
    return this.supabase.auth.signUp(credentials);
  }

  insertUserData(userData: {
    id: string;
    email: string;
    nome: string;
    numero: string;
    curso: string;
    universidade: string;
  }) {
    return this.supabase.from('users').insert(userData);
  }

  signIn(credentials: { email: string; password: string }) {
    return this.supabase.auth.signInWithPassword(credentials);
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.router.navigateByUrl('/entrar', { replaceUrl: true });
  }

  getCurrentUser(): Observable<User | boolean | null> {
    return this.currentUser.asObservable();
  }

  getCurrentUserId(): string {
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id;
    } else {
      return '';
    }
  }

  updateUserData(userData: {
    id: string;
    email?: string;
    nome?: string;
    numero?: string;
    curso?: string;
    universidade?: string;
    imagem?: string;
  }) {
    const { id, ...updateData } = userData;
    return this.supabase.from('users').update(updateData).eq('id', id);
  }

  signInWithEmail(email: string, redirectTo: string) {
    return this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
  }
}
