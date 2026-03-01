--
-- PostgreSQL database dump
--

\restrict nqeum6wII4zsRHmSPusbEeHkhtIe0Fd5Pi8h3WHMoDKKFazfTAO150Q29BjHX8f

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: communities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.communities (
    id integer NOT NULL,
    thematics text NOT NULL,
    name text NOT NULL,
    logo text,
    creation_year smallint,
    description text NOT NULL,
    icon_class character varying(50) DEFAULT 'volunteer'::character varying,
    icon_name character varying(50) DEFAULT 'fas fa-users'::character varying
);


ALTER TABLE public.communities OWNER TO postgres;

--
-- Name: communities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.communities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.communities_id_seq OWNER TO postgres;

--
-- Name: communities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.communities_id_seq OWNED BY public.communities.id;


--
-- Name: community_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.community_roles (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.community_roles OWNER TO postgres;

--
-- Name: community_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.community_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_roles_id_seq OWNER TO postgres;

--
-- Name: community_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.community_roles_id_seq OWNED BY public.community_roles.id;


--
-- Name: event_levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_levels (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.event_levels OWNER TO postgres;

--
-- Name: event_levels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_levels_id_seq OWNER TO postgres;

--
-- Name: event_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_levels_id_seq OWNED BY public.event_levels.id;


--
-- Name: event_reference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_reference (
    id integer NOT NULL,
    type text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.event_reference OWNER TO postgres;

--
-- Name: event_reference_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_reference_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_reference_id_seq OWNER TO postgres;

--
-- Name: event_reference_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_reference_id_seq OWNED BY public.event_reference.id;


--
-- Name: event_reference_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_reference_type (
    name text NOT NULL
);


ALTER TABLE public.event_reference_type OWNER TO postgres;

--
-- Name: events_media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events_media (
    id integer NOT NULL,
    poster_url text,
    text text,
    event_id integer,
    posted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.events_media OWNER TO postgres;

--
-- Name: events_media_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_media_id_seq OWNER TO postgres;

--
-- Name: events_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_media_id_seq OWNED BY public.events_media.id;


--
-- Name: events_passports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events_passports (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    date date NOT NULL,
    place text NOT NULL,
    format_id integer NOT NULL,
    event_level integer NOT NULL,
    community_role_id integer NOT NULL,
    status integer NOT NULL,
    community_id integer,
    responsible integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    qr_token text
);


ALTER TABLE public.events_passports OWNER TO postgres;

--
-- Name: events_passports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_passports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_passports_id_seq OWNER TO postgres;

--
-- Name: events_passports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_passports_id_seq OWNED BY public.events_passports.id;


--
-- Name: events_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events_status (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.events_status OWNER TO postgres;

--
-- Name: events_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_status_id_seq OWNER TO postgres;

--
-- Name: events_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_status_id_seq OWNED BY public.events_status.id;


--
-- Name: events_youth_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events_youth_policies (
    id integer NOT NULL,
    event_id integer NOT NULL,
    yonth_politic_id integer NOT NULL
);


ALTER TABLE public.events_youth_policies OWNER TO postgres;

--
-- Name: events_youth_policies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_youth_policies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_youth_policies_id_seq OWNER TO postgres;

--
-- Name: events_youth_policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_youth_policies_id_seq OWNED BY public.events_youth_policies.id;


--
-- Name: faculties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculties (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.faculties OWNER TO postgres;

--
-- Name: faculties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faculties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faculties_id_seq OWNER TO postgres;

--
-- Name: faculties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faculties_id_seq OWNED BY public.faculties.id;


--
-- Name: formats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formats (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.formats OWNER TO postgres;

--
-- Name: formats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.formats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.formats_id_seq OWNER TO postgres;

--
-- Name: formats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.formats_id_seq OWNED BY public.formats.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    name text NOT NULL,
    faculty_id integer
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.groups_id_seq OWNER TO postgres;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- Name: members_communities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.members_communities (
    id integer NOT NULL,
    user_id integer NOT NULL,
    community_id integer NOT NULL,
    date_joining date,
    role_id integer NOT NULL
);


ALTER TABLE public.members_communities OWNER TO postgres;

--
-- Name: members_communities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.members_communities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.members_communities_id_seq OWNER TO postgres;

--
-- Name: members_communities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.members_communities_id_seq OWNED BY public.members_communities.id;


--
-- Name: members_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.members_roles (
    id integer NOT NULL,
    role_name text NOT NULL
);


ALTER TABLE public.members_roles OWNER TO postgres;

--
-- Name: members_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.members_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.members_roles_id_seq OWNER TO postgres;

--
-- Name: members_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.members_roles_id_seq OWNED BY public.members_roles.id;


--
-- Name: organizers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizers (
    id integer NOT NULL,
    event_id integer NOT NULL,
    members_communitiy_id integer NOT NULL
);


ALTER TABLE public.organizers OWNER TO postgres;

--
-- Name: organizers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organizers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.organizers_id_seq OWNER TO postgres;

--
-- Name: organizers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organizers_id_seq OWNED BY public.organizers.id;


--
-- Name: participations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participations (
    id integer NOT NULL,
    event_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.participations OWNER TO postgres;

--
-- Name: participations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.participations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.participations_id_seq OWNER TO postgres;

--
-- Name: participations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.participations_id_seq OWNED BY public.participations.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    midle_name text,
    group_id integer,
    ppos boolean,
    date_birth date,
    auth_uid text NOT NULL,
    email text NOT NULL,
    name character varying(255),
    role character varying(255)
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
-- Name: youth_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.youth_policies (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.youth_policies OWNER TO postgres;

--
-- Name: youth_policies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.youth_policies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.youth_policies_id_seq OWNER TO postgres;

--
-- Name: youth_policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.youth_policies_id_seq OWNED BY public.youth_policies.id;


--
-- Name: communities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communities ALTER COLUMN id SET DEFAULT nextval('public.communities_id_seq'::regclass);


--
-- Name: community_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_roles ALTER COLUMN id SET DEFAULT nextval('public.community_roles_id_seq'::regclass);


--
-- Name: event_levels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_levels ALTER COLUMN id SET DEFAULT nextval('public.event_levels_id_seq'::regclass);


--
-- Name: event_reference id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_reference ALTER COLUMN id SET DEFAULT nextval('public.event_reference_id_seq'::regclass);


--
-- Name: events_media id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_media ALTER COLUMN id SET DEFAULT nextval('public.events_media_id_seq'::regclass);


--
-- Name: events_passports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports ALTER COLUMN id SET DEFAULT nextval('public.events_passports_id_seq'::regclass);


--
-- Name: events_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_status ALTER COLUMN id SET DEFAULT nextval('public.events_status_id_seq'::regclass);


--
-- Name: events_youth_policies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_youth_policies ALTER COLUMN id SET DEFAULT nextval('public.events_youth_policies_id_seq'::regclass);


--
-- Name: faculties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties ALTER COLUMN id SET DEFAULT nextval('public.faculties_id_seq'::regclass);


--
-- Name: formats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formats ALTER COLUMN id SET DEFAULT nextval('public.formats_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: members_communities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members_communities ALTER COLUMN id SET DEFAULT nextval('public.members_communities_id_seq'::regclass);


--
-- Name: members_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members_roles ALTER COLUMN id SET DEFAULT nextval('public.members_roles_id_seq'::regclass);


--
-- Name: organizers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizers ALTER COLUMN id SET DEFAULT nextval('public.organizers_id_seq'::regclass);


--
-- Name: participations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participations ALTER COLUMN id SET DEFAULT nextval('public.participations_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: youth_policies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.youth_policies ALTER COLUMN id SET DEFAULT nextval('public.youth_policies_id_seq'::regclass);


--
-- Data for Name: communities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.communities (id, thematics, name, logo, creation_year, description, icon_class, icon_name) FROM stdin;
1	Защита прав студентов	Профком	\N	2015	Профсоюзная организация студентов ННГАСУ. Защищаем права студентов, организуем культурно-массовые мероприятия, помогаем в решении социальных вопросов.	volunteer	fas fa-users
2	Социальная помощь и добровольчество	Волонтёры	\N	2020	Помогаем тем, кто нуждается в поддержке. Организуем сборы помощи, посещаем детские дома.	volunteer	fas fa-users
3	Фото, видео и журналистика	Медиа-центр	\N	2021	Освещаем студенческую жизнь. Снимаем репортажи, берем интервью.	volunteer	fas fa-users
4	Студенческое самоуправление	Студсовет	\N	2019	Представляем интересы студентов, организуем мероприятия.	volunteer	fas fa-users
5	Программирование и технологии	IT-сообщество	\N	2022	Изучаем современные технологии, проводим хакатоны.	volunteer	fas fa-users
6	Защита прав студентов	Профком	\N	2015	Профсоюзная организация студентов ННГАСУ.	volunteer	fas fa-users
\.


--
-- Data for Name: community_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.community_roles (id, name) FROM stdin;
1	Организатор
2	Участник
3	Волонтер
\.


--
-- Data for Name: event_levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_levels (id, name) FROM stdin;
1	Обычное
2	Крупное
3	внетерритории
\.


--
-- Data for Name: event_reference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_reference (id, type, name) FROM stdin;
\.


--
-- Data for Name: event_reference_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_reference_type (name) FROM stdin;
\.


--
-- Data for Name: events_media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events_media (id, poster_url, text, event_id, posted_at) FROM stdin;
\.


--
-- Data for Name: events_passports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events_passports (id, name, description, date, place, format_id, event_level, community_role_id, status, community_id, responsible, created_at, qr_token) FROM stdin;
12	Весенний субботник в кампусе	Уборка территории, посадка деревьев, покраска лавочек. Инвентарь предоставляется.	2026-03-25	Кампус ННГАСУ	1	1	1	1	2	\N	2026-02-25 01:25:30.202648	\N
13	Лекция по урбанистике	Приглашенный спикер расскажет о современных тенденциях в развитии городской среды.	2026-03-27	Онлайн (Zoom)	2	1	1	1	3	\N	2026-02-25 01:25:30.202648	\N
14	Студенческий квартирник	Творческий вечер с музыкой, стихами и теплой атмосферой. Ждем всех желающих выступить!	2026-03-28	Актовый зал, главный корпус	1	1	1	1	4	\N	2026-02-25 01:25:30.202648	\N
15	Хакатон по веб-разработке	Командное соревнование для разработчиков и дизайнеров. Призы и стажировки для победителей.	2026-03-30	Точка кипения	1	2	1	1	5	\N	2026-02-25 01:25:30.202648	\N
16	Открытая встреча Профкома	Расскажем о том, как получить материальную помощь, льготы и путевки. Ответим на все вопросы студентов.	2026-04-02	Кабинет 301, главный корпус	1	1	1	1	1	\N	2026-02-25 01:25:30.202648	\N
\.


--
-- Data for Name: events_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events_status (id, name) FROM stdin;
1	Активно
2	Завершено
3	Отменено
4	Черновик
\.


--
-- Data for Name: events_youth_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events_youth_policies (id, event_id, yonth_politic_id) FROM stdin;
\.


--
-- Data for Name: faculties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faculties (id, name) FROM stdin;
\.


--
-- Data for Name: formats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formats (id, name) FROM stdin;
1	Офлайн
2	Онлайн
3	Смешанный
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (id, name, faculty_id) FROM stdin;
\.


--
-- Data for Name: members_communities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.members_communities (id, user_id, community_id, date_joining, role_id) FROM stdin;
\.


--
-- Data for Name: members_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.members_roles (id, role_name) FROM stdin;
\.


--
-- Data for Name: organizers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organizers (id, event_id, members_communitiy_id) FROM stdin;
\.


--
-- Data for Name: participations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participations (id, event_id, user_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, midle_name, group_id, ppos, date_birth, auth_uid, email, name, role) FROM stdin;
13	Александр	Емельченков	\N	\N	\N	\N	2WlYRbXI13V4yZQs0Niq7GmQVuR2	a4468767@gmail.com	\N	\N
\.


--
-- Data for Name: youth_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.youth_policies (id, name) FROM stdin;
\.


--
-- Name: communities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.communities_id_seq', 6, true);


--
-- Name: community_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.community_roles_id_seq', 3, true);


--
-- Name: event_levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_levels_id_seq', 3, true);


--
-- Name: event_reference_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_reference_id_seq', 1, false);


--
-- Name: events_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_media_id_seq', 1, false);


--
-- Name: events_passports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_passports_id_seq', 16, true);


--
-- Name: events_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_status_id_seq', 1, false);


--
-- Name: events_youth_policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_youth_policies_id_seq', 1, false);


--
-- Name: faculties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faculties_id_seq', 1, false);


--
-- Name: formats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.formats_id_seq', 3, true);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_id_seq', 1, false);


--
-- Name: members_communities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.members_communities_id_seq', 1, false);


--
-- Name: members_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.members_roles_id_seq', 1, false);


--
-- Name: organizers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.organizers_id_seq', 1, false);


--
-- Name: participations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.participations_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 13, true);


--
-- Name: youth_policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.youth_policies_id_seq', 1, false);


--
-- Name: communities communities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communities
    ADD CONSTRAINT communities_pkey PRIMARY KEY (id);


--
-- Name: community_roles community_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_roles
    ADD CONSTRAINT community_roles_pkey PRIMARY KEY (id);


--
-- Name: event_levels event_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_levels
    ADD CONSTRAINT event_levels_pkey PRIMARY KEY (id);


--
-- Name: event_reference event_reference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_reference
    ADD CONSTRAINT event_reference_pkey PRIMARY KEY (id);


--
-- Name: event_reference_type event_reference_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_reference_type
    ADD CONSTRAINT event_reference_type_pkey PRIMARY KEY (name);


--
-- Name: events_media events_media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_media
    ADD CONSTRAINT events_media_pkey PRIMARY KEY (id);


--
-- Name: events_passports events_passports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_pkey PRIMARY KEY (id);


--
-- Name: events_status events_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_status
    ADD CONSTRAINT events_status_pkey PRIMARY KEY (id);


--
-- Name: events_youth_policies events_youth_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_youth_policies
    ADD CONSTRAINT events_youth_policies_pkey PRIMARY KEY (id);


--
-- Name: faculties faculties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT faculties_pkey PRIMARY KEY (id);


--
-- Name: formats formats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formats
    ADD CONSTRAINT formats_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: members_communities members_communities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members_communities
    ADD CONSTRAINT members_communities_pkey PRIMARY KEY (id);


--
-- Name: members_roles members_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members_roles
    ADD CONSTRAINT members_roles_pkey PRIMARY KEY (id);


--
-- Name: organizers organizers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizers
    ADD CONSTRAINT organizers_pkey PRIMARY KEY (id);


--
-- Name: participations participations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_pkey PRIMARY KEY (id);


--
-- Name: users unique_auth_uid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_auth_uid UNIQUE (auth_uid);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: youth_policies youth_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.youth_policies
    ADD CONSTRAINT youth_policies_pkey PRIMARY KEY (id);


--
-- Name: event_reference event_reference_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_reference
    ADD CONSTRAINT event_reference_type_fkey FOREIGN KEY (type) REFERENCES public.event_reference_type(name);


--
-- Name: events_media events_media_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_media
    ADD CONSTRAINT events_media_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events_passports(id);


--
-- Name: events_passports events_passports_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id);


--
-- Name: events_passports events_passports_community_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_community_role_id_fkey FOREIGN KEY (community_role_id) REFERENCES public.community_roles(id);


--
-- Name: events_passports events_passports_event_level_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_event_level_fkey FOREIGN KEY (event_level) REFERENCES public.event_levels(id);


--
-- Name: events_passports events_passports_format_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_format_id_fkey FOREIGN KEY (format_id) REFERENCES public.formats(id);


--
-- Name: events_passports events_passports_responsible_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_responsible_fkey FOREIGN KEY (responsible) REFERENCES public.members_communities(id);


--
-- Name: events_passports events_passports_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_status_fkey FOREIGN KEY (status) REFERENCES public.events_status(id);


--
-- Name: events_youth_policies events_youth_policies_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_youth_policies
    ADD CONSTRAINT events_youth_policies_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events_passports(id);


--
-- Name: events_youth_policies events_youth_policies_yonth_politic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_youth_policies
    ADD CONSTRAINT events_youth_policies_yonth_politic_id_fkey FOREIGN KEY (yonth_politic_id) REFERENCES public.event_reference(id);


--
-- Name: groups groups_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculties(id);


--
-- Name: members_communities members_communities_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members_communities
    ADD CONSTRAINT members_communities_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id);


--
-- Name: members_communities members_communities_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members_communities
    ADD CONSTRAINT members_communities_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.members_roles(id);


--
-- Name: members_communities members_communities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members_communities
    ADD CONSTRAINT members_communities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: organizers organizers_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizers
    ADD CONSTRAINT organizers_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events_passports(id);


--
-- Name: organizers organizers_members_communitiy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizers
    ADD CONSTRAINT organizers_members_communitiy_id_fkey FOREIGN KEY (members_communitiy_id) REFERENCES public.members_communities(id);


--
-- Name: participations participations_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events_passports(id);


--
-- Name: participations participations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users users_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- PostgreSQL database dump complete
--

\unrestrict nqeum6wII4zsRHmSPusbEeHkhtIe0Fd5Pi8h3WHMoDKKFazfTAO150Q29BjHX8f

