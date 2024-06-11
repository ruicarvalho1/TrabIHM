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
  // Supabase client
  private supabase: SupabaseClient;
  // Current user
  private currentUser: BehaviorSubject<User | boolean | null> =
    new BehaviorSubject<User | boolean | null>(null);

  // Construtor das dependências
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

    // Trigger inicial para carregamento de dados da sessão
    this.loadUser();
  }
  // Função para carregar o utilizador
  async loadUser() {
    if (this.currentUser.value) {
      return;
    }
    const user = await this.supabase.auth.getUser();

    if (user.data.user) {
      this.currentUser.next(user.data.user);
    } else {
      this.currentUser.next(false);
    }
  }

  // Função para registar
  signUp(credentials: { email: string; password: string }) {
    return this.supabase.auth.signUp(credentials);
  }

  // Função para inserir dados do utilizador
  async insertUserData(userData: {
    id: string;
    email: string;
    nome: string;
    numero: string;
    curso: string;
    universidade: string;
  }) {
    try {
      const { data: existingUser, error: fetchError } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', userData.email)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingUser) {
        return { error: { message: 'Este email já está registado.' } };
      }

      const { data: insertedUser, error: insertError } = await this.supabase
        .from('users')
        .insert([userData]);

      if (insertError) {
        throw insertError;
      }

      return { data: insertedUser };
    } catch (error) {
      return { error };
    }
  }
  // Função para iniciar sessão
  signIn(credentials: { email: string; password: string }) {
    return this.supabase.auth.signInWithPassword(credentials);
  }

  // Função para sair
  async signOut() {
    await this.supabase.auth.signOut();
    this.router.navigateByUrl('/entrar', { replaceUrl: true });
  }
  // Função para obter o utilizador atual
  getCurrentUser(): Observable<User | boolean | null> {
    return this.currentUser.asObservable();
  }

  // Função para obter o ID do utilizador atual
  getCurrentUserId(): string {
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id;
    } else {
      return '';
    }
  }
  // Função para atualizar os dados do utilizador
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
  // Função para enviar email de verificação
  signInWithEmail(email: string, redirectTo: string) {
    return this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
  }
}
