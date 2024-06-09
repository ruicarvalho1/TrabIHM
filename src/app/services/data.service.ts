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

      /* Construir a URL pública manualmente*/

      const publicURL = `${environment.supabaseUrl}/storage/v1/object/public/images/${data.path}`;

      return publicURL; // Retorna a URL pública da imagem
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  async uploadImagemPerfil(file: File): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage
        .from('images')
        .upload(`perfil/${file.name}`, file, {
          cacheControl: '3600',
          contentType: 'image/png',
        });

      if (error) {
        throw error;
      }

      /* Contrução da URL pública manualmente*/
      const publicURL = `${environment.supabaseUrl}/storage/v1/object/public/images/${data.path}`;

      return publicURL; /* Retorna a URL pública da imagem*/
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  async uploadImagemDisciplina(file: File): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage
        .from('images')
        .upload(`disciplinas/${file.name}`, file, {
          cacheControl: '3600',
          contentType: 'image/png',
        });

      if (error) {
        throw error;
      }

      /* Contrução da URL pública manualmente para o (supabase storage)*/
      const publicURL = `${environment.supabaseUrl}/storage/v1/object/public/images/${data.path}`;

      return publicURL; /* Retorna a URL pública da imagem*/
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  /* Objeto de nova tarefa para ser enviado para a base de dados */
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
      /*Tipo de ORM para criação de queries sem o uso de SQL diretamente, 
      havendo uma abstração para maior segurança contra SQL Injection por exemplo.*/
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

  async createDisciplina(createDisciplina: {
    nome: string;
    area_estudo: boolean;
    notas: string;
    imagem: string;
  }) {
    try {
      const { data, error } = await this.supabase
        .from('disciplinas')
        .insert([createDisciplina])
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
      .select('email, nome, numero, curso, universidade,imagem')
      .eq('id', id)
      .single()
      .then((result) => result.data);
  }

  getAllDisciplinas() {
    return this.supabase
      .from('disciplinas')
      .select(`*`)
      .then((result) => result.data || []);
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

  async getDisciplinaById(id: string) {
    return await this.supabase
      .from('disciplinas')
      .select('*')
      .eq('id_disciplina', id)
      .single();
  }

  async atualizarTarefa(idTarefa: number, concluida: boolean): Promise<any> {
    // Verifica se o ID da tarefa é válido
    if (typeof idTarefa !== 'number' || isNaN(idTarefa)) {
      console.error('ID da tarefa inválido:', idTarefa);
      throw new Error('ID da tarefa inválido');
    }

    try {
      // Atualiza apenas o campo 'concluída' da tarefa na base de dados
      const { error } = await this.supabase
        .from('tarefas')
        .update({ concluida: concluida })
        .eq('id_tarefa', idTarefa);

      if (error) {
        console.error('Erro ao atualizar a tarefa:', error);
        throw error;
      }

      // Procura os dados atualizados da tarefa após a atualização na base de dados
      const { data: updatedTarefa, error: fetchError } = await this.supabase
        .from('tarefas')
        .select('*')
        .eq('id_tarefa', idTarefa)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar a tarefa atualizada:', fetchError);
        throw fetchError;
      }

      console.log('Tarefa atualizada com sucesso:', updatedTarefa);
      return updatedTarefa;
    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error);
      throw error;
    }
  }

  async getDisciplinaIdForUser(userId: string): Promise<number | null> {
    try {
      const { data, error } = await this.supabase
        .from('disciplinas')
        .select('id_disciplina')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao obter a disciplina para o usuário:', error);
        return null;
      }

      if (!data) {
        console.error('Nenhuma disciplina encontrada para este usuário.');
        return null;
      }

      return data.id_disciplina;
    } catch (error) {
      console.error('Erro ao obter a disciplina do usuário:', error);
      throw error;
    }
  }

  async getTarefasPorDisciplina(idDisciplina: number): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('tarefas')
        .select('*')
        .eq('disciplina_id', idDisciplina);

      if (error) {
        console.error('Erro ao obter as tarefas:', error);
        return [];
      }

      if (!data) {
        console.error('Nenhuma tarefa encontrada para esta disciplina.');
        return [];
      }

      return data;
    } catch (error) {
      console.error('Erro ao obter as tarefas:', error);
      return [];
    }
  }

  async getDisciplinaPorTarefa(idDisciplina: number): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('disciplinas')
        .select('nome')
        .eq('id_disciplina', idDisciplina)
        .single();

      if (error) {
        console.error('Erro ao obter a disciplina:', error);
        return null;
      }

      if (!data) {
        console.error('Disciplina não encontrada.');
        return null;
      }

      return data.nome;
    } catch (error) {
      console.error('Erro ao obter o nome da disciplina:', error);
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
