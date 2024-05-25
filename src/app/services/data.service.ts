/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import {
  SupabaseClient,
  createClient,
  RealtimeChannel,
} from '@supabase/supabase-js';
import { ReplaySubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageError } from '@supabase/storage-js';

const GROUPS_DB = 'groups';
const MESSAGES_DB = 'messages';
const USERS_DB = 'users';

export interface Message {
  created_at: string;
  group_id: number;
  id: number;
  text: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  getUser() {
    throw new Error('Method not implemented.');
  }
  private supabase: SupabaseClient;
  private realtimeChannel: RealtimeChannel | null = null;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  getGroups() {
    return this.supabase
      .from(GROUPS_DB)
      .select(`title, id, users:creator (email)`)
      .then((result) => result.data || []);
  }

  async createGroup(title: string) {
    const user = await this.supabase.auth.getUser();
    const newgroup = {
      creator: user?.data?.user?.id,
      title,
    };

    return this.supabase.from(GROUPS_DB).insert(newgroup).select().single();
  }

  async uploadImagem(file: File): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage
        .from('images')
        .upload(`images/${file.name}`, file, {
          cacheControl: '3600',
          contentType: 'image/png',
        });

      if (error) {
        throw error;
      }

      // Construir a URL pública manualmente
      const publicURL = `${environment.supabaseUrl}/storage/v1/object/public/images/${data.path}`;

      return publicURL; // Retorna a URL pública da imagem
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  async createTarefa(novaTarefa: {
    prioridade: string;
    concluida: boolean;
    tarefa: string;
    nome_tarefa: string;
    data_limite: string;
    imagem: string;
    user_id: string;
    disciplina_id: number;
  }) {
    try {
      const { data, error } = await this.supabase
        .from('tarefas')
        .insert([novaTarefa])
        .single();
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  getUserById(id: any) {
    return this.supabase
      .from(USERS_DB)
      .select('email, nome, numero, curso, universidade')
      .eq('id', id)
      .single()
      .then((result) => result.data);
  }

  async getTarefasDoUsuario(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('tarefas')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao obter as tarefas do usuário:', error);
      return [];
    }
  }

  async getTarefasPorDisciplina(idDisciplina: string): Promise<any[]> {
    try {
      const response = await this.supabase
        .from('tarefas')
        .select('*')
        .eq('disciplina_id', idDisciplina)
        .order('data_limite', { ascending: true });
      return response.data || [];
    } catch (error) {
      console.error('Erro ao obter tarefas por disciplina:', error);
      throw error;
    }
  }
  async addGroupMessage(groupId: string, message: string) {
    const newMessage = {
      text: message,
      user_id: (await this.supabase.auth.getUser())?.data?.user?.id,
      group_id: groupId,
    };

    console.log('NEW: ', newMessage);

    return this.supabase.from(MESSAGES_DB).insert(newMessage);
  }

  getGroupMessages(groupId: any) {
    return this.supabase
      .from(MESSAGES_DB)
      .select(`created_at, text, id, users:user_id ( email, id )`)
      .match({ group_id: groupId })
      .then((result) => result.data);
  }

  listenToGroup(groupI: any) {
    const changes = new Subject();

    this.realtimeChannel = this.supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        async (payload) => {
          console.log('DB CHANGE: ', payload);

          if (payload.new && (payload.new as Message).group_id === +groupI) {
            const msgId = (payload.new as any).id;
            console.log('load message: ', msgId);

            const msg = await this.supabase
              .from(MESSAGES_DB)
              .select(`created_at, text, id, users:user_id ( email, id )`)
              .match({ id: msgId })
              .single()
              .then((result) => result.data);
            changes.next(msg);
          }
        }
      )
      .subscribe();

    return changes.asObservable();
  }

  unsubscribeGroupChanges() {
    if (this.realtimeChannel) {
      console.log('REMOVE CHANNEL');
      this.supabase.removeChannel(this.realtimeChannel);
    }
  }

  /*async getUserTasksAndDisciplines() {
    try {


      const { data, error } = await this.supabase.rpc(
        'get_user_tarefas_disciplinas'
      );
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Erro ao obter tarefas e disciplinas do usuário:', error);
      throw error;
    }



  }*/

  async getDisciplinasTarefasTrue(userId: string, id_disciplina: number) {
    const { data, error } = await this.supabase
      .from('tarefas')
      .select('concluida', { count: 'exact' })
      .eq('user_id', userId)
      .eq('concluida', true)
      .eq('disciplina_id', id_disciplina);

    if (error) {
      throw error;
    }
    let tarefasTrue: number = data.length;

    return tarefasTrue;
  }

  async getDisciplinasTarefasFalse(userId: string, id_disciplina: number) {
    const { data, error } = await this.supabase
      .from('tarefas')
      .select('concluida', { count: 'exact' })
      .eq('user_id', userId)
      .eq('concluida', false)
      .eq('disciplina_id', id_disciplina);

    if (error) {
      throw error;
    }
    let tarefasFalse: number = data.length;
    return tarefasFalse;
  }

  async getDisciplinasDoUsuario(userId: string) {
    try {
      let percentagem: number = 0;

      const { data, error } = await this.supabase
        .from('disciplinas')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('Não há disciplinas associadas a este usuário.');
      }

      for (let disciplina of data) {
        let tarefasFalse = await this.getDisciplinasTarefasFalse(
          userId,
          disciplina.id_disciplina
        );
        let tarefasTrue = await this.getDisciplinasTarefasTrue(
          userId,
          disciplina.id_disciplina
        );
        disciplina.verdade = tarefasTrue;
        disciplina.falso = tarefasFalse;

        if (tarefasFalse + tarefasTrue === 0) {
          disciplina.percentagem = 0 + '%';
        } else {
          disciplina.percentagem =
            ((tarefasTrue / (tarefasFalse + tarefasTrue)) * 100).toFixed(2) +
            '%';
        }
      }

      return data;

      //return data || [];
    } catch (error) {
      console.error('Erro ao obter as disciplinas do usuário:', error);
      return [];
    }
  }
}
