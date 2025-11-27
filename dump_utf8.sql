--
-- PostgreSQL database dump
--

\restrict wGiUmm5dcR1M81muthiMMidKvdCDSDeERlF0h737ibvK6MWfmacXyZuawLMasQ8

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: todo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.todo (
    id integer NOT NULL,
    body character varying(300) NOT NULL,
    completed boolean NOT NULL,
    list character varying(50) NOT NULL
);


ALTER TABLE public.todo OWNER TO postgres;

--
-- Name: todo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.todo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.todo_id_seq OWNER TO postgres;

--
-- Name: todo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.todo_id_seq OWNED BY public.todo.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(300) NOT NULL,
    user_password character varying(300) NOT NULL,
    email character varying(300) NOT NULL,
    xp integer NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: todo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todo ALTER COLUMN id SET DEFAULT nextval('public.todo_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: todo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.todo (id, body, completed, list) FROM stdin;
24	Configurer un nouveau composant React pour la page profil	t	Dev
22	Mettre ├á jour la documentation du projet	t	Travail
1	Acheter du pain frais et du lait	f	Courses
2	Envoyer le rapport hebdomadaire au chef de projet	f	Travail
3	R├®viser le chapitre sur les promesses en JavaScript	f	├ëtudes
4	Nettoyer la cuisine et vider le lave-vaisselle	f	Maison
5	Faire une s├®ance de musculation full body	f	Sant├®
6	Cr├®er une nouvelle branche Git pour la fonctionnalit├® login	f	Dev
7	Relire les notes du cours SQL sur les jointures	f	├ëtudes
8	Pr├®parer la liste des cadeaux de No├½l	f	Perso
9	Mettre ├á jour le portfolio avec le projet ToDoList	f	Dev
13	Faire une sauvegarde du projet local sur GitHub	f	Dev
16	Faire le tri dans les fichiers du disque dur	f	Organisation
15	Cuisiner un plat maison pour la semaine	f	Cuisine
12	Aller courir 5 km dans le parc	f	Sant├®
11	Lire 20 pages du livre en cours	f	Lecture
10	V├®rifier les mails professionnels	f	Travail
20	Tester le script dÔÇÖauthentification sur le serveur local	t	Dev
19	Revoir la maquette Figma de lÔÇÖapplication	t	Design
18	R├®pondre aux messages non lus sur Slack	t	Travail
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, user_password, email, xp) FROM stdin;
1	astarion	123	nicolas.lavarde@gmail.com	0
\.


--
-- Name: todo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.todo_id_seq', 45, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: todo todo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todo
    ADD CONSTRAINT todo_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict wGiUmm5dcR1M81muthiMMidKvdCDSDeERlF0h737ibvK6MWfmacXyZuawLMasQ8

