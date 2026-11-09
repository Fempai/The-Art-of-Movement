-- Twerk RLS smoke test. Run using a privileged SQL console, not from a browser.
-- Requires two existing auth.users. All test writes are rolled back.
begin;
create temp table _aom_test_ids as select id,row_number() over(order by id) rn from auth.users limit 2;
grant select on _aom_test_ids to authenticated;
select set_config('request.jwt.claim.sub',(select id::text from _aom_test_ids where rn=1),true);
set local role authenticated;
do $$
declare a uuid; b uuid; n int; blocked boolean;
begin
 select id into a from _aom_test_ids where rn=1;
 select id into b from _aom_test_ids where rn=2;
 if a is null or b is null then raise exception 'Two accounts required'; end if;
 insert into public.aom_twerk_written_review_progress(user_id,lesson_id,reviewed)
 values(a,'TWK401-08',true) on conflict(user_id,lesson_id) do update set reviewed=true;
 select count(*) into n from public.aom_twerk_written_review_progress where user_id=a and lesson_id='TWK401-08';
 if n<>1 then raise exception 'Owner cannot read review'; end if;
 select count(*) into n from public.aom_twerk_written_review_progress where user_id=b;
 if n<>0 then raise exception 'Cross-account review read'; end if;
 blocked:=false;
 begin
  insert into public.aom_twerk_written_review_progress(user_id,lesson_id,reviewed) values(b,'TWK401-07',true);
 exception when insufficient_privilege or check_violation then blocked:=true; end;
 if not blocked then raise exception 'Cross-account review insert succeeded'; end if;
 insert into public.aom_lesson_quiz_progress(user_id,lesson_id,score,total)
 values(a,'TWK401-08',3,4) on conflict(user_id,lesson_id) do update set score=3,total=4;
 select count(*) into n from public.aom_lesson_quiz_progress where user_id=a and lesson_id='TWK401-08';
 if n<>1 then raise exception 'Owner cannot read quiz'; end if;
 select count(*) into n from public.aom_lesson_quiz_progress where user_id=b;
 if n<>0 then raise exception 'Cross-account quiz read'; end if;
 blocked:=false;
 begin
  insert into public.aom_lesson_quiz_progress(user_id,lesson_id,score,total) values(b,'TWK401-07',4,4);
 exception when insufficient_privilege or check_violation then blocked:=true; end;
 if not blocked then raise exception 'Cross-account quiz insert succeeded'; end if;
 -- Switch to account B inside the same transaction: account A's rows must disappear.
 perform set_config('request.jwt.claim.sub',b::text,true);
 select count(*) into n from public.aom_twerk_written_review_progress where user_id=a and lesson_id='TWK401-08';
 if n<>0 then raise exception 'Account B can see account A review'; end if;
 select count(*) into n from public.aom_lesson_quiz_progress where user_id=a and lesson_id='TWK401-08';
 if n<>0 then raise exception 'Account B can see account A quiz'; end if;
 -- Switch back: account A's test rows should still be visible.
 perform set_config('request.jwt.claim.sub',a::text,true);
 select count(*) into n from public.aom_twerk_written_review_progress where user_id=a and lesson_id='TWK401-08';
 if n<>1 then raise exception 'Account A review missing after switch'; end if;
 select count(*) into n from public.aom_lesson_quiz_progress where user_id=a and lesson_id='TWK401-08';
 if n<>1 then raise exception 'Account A quiz missing after switch'; end if;
end $;
rollback;
