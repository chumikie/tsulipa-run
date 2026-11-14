-- Jogadores de teste: A (eu), B, C, D com avatar; E sem avatar; F bloqueado.
insert into auth.users values ('00000000-0000-0000-0000-00000000000a'),('00000000-0000-0000-0000-00000000000b'),
 ('00000000-0000-0000-0000-00000000000c'),('00000000-0000-0000-0000-00000000000d'),('00000000-0000-0000-0000-00000000000e'),('00000000-0000-0000-0000-00000000000f');
insert into public.players(id,nick,avatar,bloqueado) values
 ('00000000-0000-0000-0000-00000000000a','Ana','{}',false),('00000000-0000-0000-0000-00000000000b','Bia','{}',false),
 ('00000000-0000-0000-0000-00000000000c','Caio','{}',false),('00000000-0000-0000-0000-00000000000d','Duda','{}',false),
 ('00000000-0000-0000-0000-00000000000e','Edu',null,false),('00000000-0000-0000-0000-00000000000f','Fe','{}',true);
-- Ana: 3 cópias de Bia (Gacha), 1 de Caio, e 2 do próprio card (aniversário).
insert into public.gacha(user_id,dia,tipo,valor) values
 ('00000000-0000-0000-0000-00000000000a','2026-10-01','card','Bia'),('00000000-0000-0000-0000-00000000000a','2026-10-02','card','bia '),
 ('00000000-0000-0000-0000-00000000000a','2026-10-03','card','Bia'),('00000000-0000-0000-0000-00000000000a','2026-10-04','card','Caio');
insert into public.aniver_presentes(user_id) values ('00000000-0000-0000-0000-00000000000a'),('00000000-0000-0000-0000-00000000000a');
-- Bia: 2 de Caio (para propor troca com Ana).
insert into public.gacha(user_id,dia,tipo,valor) values
 ('00000000-0000-0000-0000-00000000000b','2026-10-01','card','Caio'),('00000000-0000-0000-0000-00000000000b','2026-10-02','card','Caio');
