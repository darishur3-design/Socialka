--
-- PostgreSQL database dump
--

\restrict r22iYZRM0fiJLk6lEX5hbnI4gRbXI02Ncfp3RL7MREvW9OvBoXb117BYgJqNbCp

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-03-09 13:35:09

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
-- TOC entry 239 (class 1259 OID 16528)
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
-- TOC entry 238 (class 1259 OID 16527)
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
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 238
-- Name: communities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.communities_id_seq OWNED BY public.communities.id;


--
-- TOC entry 224 (class 1259 OID 16428)
-- Name: community_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.community_roles (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.community_roles OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16427)
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
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 223
-- Name: community_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.community_roles_id_seq OWNED BY public.community_roles.id;


--
-- TOC entry 259 (class 1259 OID 16815)
-- Name: event_budget; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_budget (
    id integer NOT NULL,
    item_name text NOT NULL,
    price numeric(38,2) NOT NULL,
    quantity integer NOT NULL,
    event_id integer NOT NULL,
    CONSTRAINT event_budget_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT event_budget_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.event_budget OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 16814)
-- Name: event_budget_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.event_budget ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.event_budget_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 16448)
-- Name: event_levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_levels (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.event_levels OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16447)
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
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 227
-- Name: event_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_levels_id_seq OWNED BY public.event_levels.id;


--
-- TOC entry 257 (class 1259 OID 16799)
-- Name: event_mto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_mto (
    id integer NOT NULL,
    item_name text NOT NULL,
    event_id integer NOT NULL
);


ALTER TABLE public.event_mto OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 16798)
-- Name: event_mto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.event_mto ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.event_mto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 261 (class 1259 OID 16835)
-- Name: event_print_materials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_print_materials (
    id integer NOT NULL,
    event_id integer NOT NULL,
    name text NOT NULL,
    format text NOT NULL,
    paper_type text NOT NULL,
    price numeric(38,2) NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT event_print_materials_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT event_print_materials_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.event_print_materials OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 16834)
-- Name: event_print_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.event_print_materials ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.event_print_materials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 235 (class 1259 OID 16487)
-- Name: event_reference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_reference (
    id integer NOT NULL,
    type text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.event_reference OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16486)
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
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 234
-- Name: event_reference_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_reference_id_seq OWNED BY public.event_reference.id;


--
-- TOC entry 233 (class 1259 OID 16478)
-- Name: event_reference_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_reference_type (
    name text NOT NULL
);


ALTER TABLE public.event_reference_type OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 16775)
-- Name: event_timeline; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_timeline (
    id integer NOT NULL,
    time_range text NOT NULL,
    place text NOT NULL,
    description text NOT NULL,
    event_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.event_timeline OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 16774)
-- Name: event_timeline_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.event_timeline ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.event_timeline_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 249 (class 1259 OID 16656)
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
-- TOC entry 248 (class 1259 OID 16655)
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
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 248
-- Name: events_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_media_id_seq OWNED BY public.events_media.id;


--
-- TOC entry 243 (class 1259 OID 16567)
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
    qr_token text,
    community_leader character varying(255),
    direction_id integer,
    qualitative character varying(255),
    quantitative character varying(255),
    responsible_phone character varying(255),
    smart_goal character varying(255),
    target_audience character varying(255)
);


ALTER TABLE public.events_passports OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16566)
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
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 242
-- Name: events_passports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_passports_id_seq OWNED BY public.events_passports.id;


--
-- TOC entry 232 (class 1259 OID 16468)
-- Name: events_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events_status (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.events_status OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16467)
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
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 231
-- Name: events_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_status_id_seq OWNED BY public.events_status.id;


--
-- TOC entry 251 (class 1259 OID 16672)
-- Name: events_youth_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events_youth_policies (
    id integer NOT NULL,
    event_id integer NOT NULL,
    yonth_politic_id integer NOT NULL
);


ALTER TABLE public.events_youth_policies OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 16671)
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
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 250
-- Name: events_youth_policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_youth_policies_id_seq OWNED BY public.events_youth_policies.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: faculties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculties (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.faculties OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
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
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 219
-- Name: faculties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faculties_id_seq OWNED BY public.faculties.id;


--
-- TOC entry 230 (class 1259 OID 16458)
-- Name: formats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formats (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.formats OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16457)
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
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 229
-- Name: formats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.formats_id_seq OWNED BY public.formats.id;


--
-- TOC entry 222 (class 1259 OID 16401)
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    name text NOT NULL,
    faculty_id integer
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16400)
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
-- TOC entry 5261 (class 0 OID 0)
-- Dependencies: 221
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- TOC entry 241 (class 1259 OID 16541)
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
-- TOC entry 240 (class 1259 OID 16540)
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
-- TOC entry 5262 (class 0 OID 0)
-- Dependencies: 240
-- Name: members_communities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.members_communities_id_seq OWNED BY public.members_communities.id;


--
-- TOC entry 253 (class 1259 OID 16766)
-- Name: members_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.members_roles (
    id integer NOT NULL,
    role_name character varying(50) NOT NULL,
    description character varying(200)
);


ALTER TABLE public.members_roles OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 16765)
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
-- TOC entry 5263 (class 0 OID 0)
-- Dependencies: 252
-- Name: members_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.members_roles_id_seq OWNED BY public.members_roles.id;


--
-- TOC entry 247 (class 1259 OID 16636)
-- Name: organizers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizers (
    id integer NOT NULL,
    event_id integer NOT NULL,
    members_communitiy_id integer NOT NULL,
    responsibility character varying(255),
    user_id integer
);


ALTER TABLE public.organizers OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 16635)
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
-- TOC entry 5264 (class 0 OID 0)
-- Dependencies: 246
-- Name: organizers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organizers_id_seq OWNED BY public.organizers.id;


--
-- TOC entry 245 (class 1259 OID 16616)
-- Name: participations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participations (
    id integer NOT NULL,
    event_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.participations OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16615)
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
-- TOC entry 5265 (class 0 OID 0)
-- Dependencies: 244
-- Name: participations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.participations_id_seq OWNED BY public.participations.id;


--
-- TOC entry 237 (class 1259 OID 16504)
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
-- TOC entry 236 (class 1259 OID 16503)
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
-- TOC entry 5266 (class 0 OID 0)
-- Dependencies: 236
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 226 (class 1259 OID 16438)
-- Name: youth_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.youth_policies (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.youth_policies OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16437)
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
-- TOC entry 5267 (class 0 OID 0)
-- Dependencies: 225
-- Name: youth_policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.youth_policies_id_seq OWNED BY public.youth_policies.id;


--
-- TOC entry 4969 (class 2604 OID 16531)
-- Name: communities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communities ALTER COLUMN id SET DEFAULT nextval('public.communities_id_seq'::regclass);


--
-- TOC entry 4962 (class 2604 OID 16431)
-- Name: community_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_roles ALTER COLUMN id SET DEFAULT nextval('public.community_roles_id_seq'::regclass);


--
-- TOC entry 4964 (class 2604 OID 16451)
-- Name: event_levels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_levels ALTER COLUMN id SET DEFAULT nextval('public.event_levels_id_seq'::regclass);


--
-- TOC entry 4967 (class 2604 OID 16490)
-- Name: event_reference id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_reference ALTER COLUMN id SET DEFAULT nextval('public.event_reference_id_seq'::regclass);


--
-- TOC entry 4977 (class 2604 OID 16659)
-- Name: events_media id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_media ALTER COLUMN id SET DEFAULT nextval('public.events_media_id_seq'::regclass);


--
-- TOC entry 4973 (class 2604 OID 16570)
-- Name: events_passports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports ALTER COLUMN id SET DEFAULT nextval('public.events_passports_id_seq'::regclass);


--
-- TOC entry 4966 (class 2604 OID 16471)
-- Name: events_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_status ALTER COLUMN id SET DEFAULT nextval('public.events_status_id_seq'::regclass);


--
-- TOC entry 4979 (class 2604 OID 16675)
-- Name: events_youth_policies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_youth_policies ALTER COLUMN id SET DEFAULT nextval('public.events_youth_policies_id_seq'::regclass);


--
-- TOC entry 4960 (class 2604 OID 16393)
-- Name: faculties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties ALTER COLUMN id SET DEFAULT nextval('public.faculties_id_seq'::regclass);


--
-- TOC entry 4965 (class 2604 OID 16461)
-- Name: formats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formats ALTER COLUMN id SET DEFAULT nextval('public.formats_id_seq'::regclass);


--
-- TOC entry 4961 (class 2604 OID 16404)
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- TOC entry 4972 (class 2604 OID 16544)
-- Name: members_communities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members_communities ALTER COLUMN id SET DEFAULT nextval('public.members_communities_id_seq'::regclass);


--
-- TOC entry 4980 (class 2604 OID 16769)
-- Name: members_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members_roles ALTER COLUMN id SET DEFAULT nextval('public.members_roles_id_seq'::regclass);


--
-- TOC entry 4976 (class 2604 OID 16639)
-- Name: organizers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizers ALTER COLUMN id SET DEFAULT nextval('public.organizers_id_seq'::regclass);


--
-- TOC entry 4975 (class 2604 OID 16619)
-- Name: participations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participations ALTER COLUMN id SET DEFAULT nextval('public.participations_id_seq'::regclass);


--
-- TOC entry 4968 (class 2604 OID 16693)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4963 (class 2604 OID 16441)
-- Name: youth_policies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.youth_policies ALTER COLUMN id SET DEFAULT nextval('public.youth_policies_id_seq'::regclass);


--
-- TOC entry 5223 (class 0 OID 16528)
-- Dependencies: 239
-- Data for Name: communities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.communities (id, thematics, name, logo, creation_year, description, icon_class, icon_name) FROM stdin;
1	Защита прав студентов	Профком	\N	2015	Профсоюзная организация студентов ННГАСУ. Защищаем права студентов, организуем культурно-массовые мероприятия, помогаем в решении социальных вопросов.	volunteer	fas fa-users
2	Социальная помощь и добровольчество	Волонтёры	\N	2020	Помогаем тем, кто нуждается в поддержке. Организуем сборы помощи, посещаем детские дома.	volunteer	fas fa-users
3	Фото, видео и журналистика	Медиа-центр	\N	2021	Освещаем студенческую жизнь. Снимаем репортажи, берем интервью.	volunteer	fas fa-users
4	Студенческое самоуправление	Студсовет	\N	2019	Представляем интересы студентов, организуем мероприятия.	volunteer	fas fa-users
5	Программирование и технологии	IT-сообщество	\N	2022	Изучаем современные технологии, проводим хакатоны.	volunteer	fas fa-users
\.


--
-- TOC entry 5208 (class 0 OID 16428)
-- Dependencies: 224
-- Data for Name: community_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.community_roles (id, name) FROM stdin;
1	Организатор
2	Участник
3	Волонтер
\.


--
-- TOC entry 5243 (class 0 OID 16815)
-- Dependencies: 259
-- Data for Name: event_budget; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_budget (id, item_name, price, quantity, event_id) FROM stdin;
\.


--
-- TOC entry 5212 (class 0 OID 16448)
-- Dependencies: 228
-- Data for Name: event_levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_levels (id, name) FROM stdin;
1	Обычное
2	Крупное
3	внетерритории
\.


--
-- TOC entry 5241 (class 0 OID 16799)
-- Dependencies: 257
-- Data for Name: event_mto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_mto (id, item_name, event_id) FROM stdin;
\.


--
-- TOC entry 5245 (class 0 OID 16835)
-- Dependencies: 261
-- Data for Name: event_print_materials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_print_materials (id, event_id, name, format, paper_type, price, quantity) FROM stdin;
\.


--
-- TOC entry 5219 (class 0 OID 16487)
-- Dependencies: 235
-- Data for Name: event_reference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_reference (id, type, name) FROM stdin;
\.


--
-- TOC entry 5217 (class 0 OID 16478)
-- Dependencies: 233
-- Data for Name: event_reference_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_reference_type (name) FROM stdin;
\.


--
-- TOC entry 5239 (class 0 OID 16775)
-- Dependencies: 255
-- Data for Name: event_timeline; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_timeline (id, time_range, place, description, event_id, user_id) FROM stdin;
\.


--
-- TOC entry 5233 (class 0 OID 16656)
-- Dependencies: 249
-- Data for Name: events_media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events_media (id, poster_url, text, event_id, posted_at) FROM stdin;
\.


--
-- TOC entry 5227 (class 0 OID 16567)
-- Dependencies: 243
-- Data for Name: events_passports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events_passports (id, name, description, date, place, format_id, event_level, community_role_id, status, community_id, responsible, created_at, qr_token, community_leader, direction_id, qualitative, quantitative, responsible_phone, smart_goal, target_audience) FROM stdin;
15	Хакатон по веб-разработке	Командное соревнование для разработчиков и дизайнеров. Призы и стажировки для победителей.	2026-03-30	Точка кипения	1	2	1	2	5	\N	2026-02-25 01:25:30.202648	\N	\N	\N	\N	\N	\N	\N	\N
14	Студенческий квартирник	Творческий вечер с музыкой, стихами и теплой атмосферой. Ждем всех желающих выступить!	2026-03-28	Актовый зал, главный корпус	1	1	1	2	4	\N	2026-02-25 01:25:30.202648	\N	\N	\N	\N	\N	\N	\N	\N
12	Весенний субботник в кампусе	Уборка территории, посадка деревьев, покраска лавочек. Инвентарь предоставляется.	2026-03-25	Кампус ННГАСУ	1	1	1	2	2	\N	2026-02-25 01:25:30.202648	\N	\N	\N	\N	\N	\N	\N	\N
16	Открытая встреча Профкома	Расскажем о том, как получить материальную помощь, льготы и путевки. Ответим на все вопросы студентов.	2026-04-02	Кабинет 301, главный корпус	1	1	1	2	1	\N	2026-02-25 01:25:30.202648	\N	\N	\N	\N	\N	\N	\N	\N
13	Лекция по урбанистике	Приглашенный спикер расскажет о современных тенденциях в развитии городской среды.	2026-03-27	Онлайн (Zoom)	2	1	1	2	3	\N	2026-02-25 01:25:30.202648	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5216 (class 0 OID 16468)
-- Dependencies: 232
-- Data for Name: events_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events_status (id, name) FROM stdin;
1	Активно
2	Завершено
3	Отменено
4	Черновик
\.


--
-- TOC entry 5235 (class 0 OID 16672)
-- Dependencies: 251
-- Data for Name: events_youth_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events_youth_policies (id, event_id, yonth_politic_id) FROM stdin;
\.


--
-- TOC entry 5204 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: faculties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faculties (id, name) FROM stdin;
\.


--
-- TOC entry 5214 (class 0 OID 16458)
-- Dependencies: 230
-- Data for Name: formats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formats (id, name) FROM stdin;
1	Офлайн
2	Онлайн
3	Смешанный
\.


--
-- TOC entry 5206 (class 0 OID 16401)
-- Dependencies: 222
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (id, name, faculty_id) FROM stdin;
\.


--
-- TOC entry 5225 (class 0 OID 16541)
-- Dependencies: 241
-- Data for Name: members_communities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.members_communities (id, user_id, community_id, date_joining, role_id) FROM stdin;
2	13	2	2026-03-02	1
4	13	3	2026-03-02	1
5	13	1	2026-03-05	1
\.


--
-- TOC entry 5237 (class 0 OID 16766)
-- Dependencies: 253
-- Data for Name: members_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.members_roles (id, role_name, description) FROM stdin;
1	Участник	Обычный участник сообщества
2	Администратор	Администратор сообщества
3	Руководитель	Руководитель сообщества
\.


--
-- TOC entry 5231 (class 0 OID 16636)
-- Dependencies: 247
-- Data for Name: organizers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organizers (id, event_id, members_communitiy_id, responsibility, user_id) FROM stdin;
\.


--
-- TOC entry 5229 (class 0 OID 16616)
-- Dependencies: 245
-- Data for Name: participations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participations (id, event_id, user_id) FROM stdin;
\.


--
-- TOC entry 5221 (class 0 OID 16504)
-- Dependencies: 237
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, midle_name, group_id, ppos, date_birth, auth_uid, email, name, role) FROM stdin;
13	Александр	Емельченков	\N	\N	\N	\N	2WlYRbXI13V4yZQs0Niq7GmQVuR2	a4468767@gmail.com	\N	\N
\.


--
-- TOC entry 5210 (class 0 OID 16438)
-- Dependencies: 226
-- Data for Name: youth_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.youth_policies (id, name) FROM stdin;
\.


--
-- TOC entry 5268 (class 0 OID 0)
-- Dependencies: 238
-- Name: communities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.communities_id_seq', 6, true);


--
-- TOC entry 5269 (class 0 OID 0)
-- Dependencies: 223
-- Name: community_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.community_roles_id_seq', 3, true);


--
-- TOC entry 5270 (class 0 OID 0)
-- Dependencies: 258
-- Name: event_budget_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_budget_id_seq', 1, false);


--
-- TOC entry 5271 (class 0 OID 0)
-- Dependencies: 227
-- Name: event_levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_levels_id_seq', 3, true);


--
-- TOC entry 5272 (class 0 OID 0)
-- Dependencies: 256
-- Name: event_mto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_mto_id_seq', 1, false);


--
-- TOC entry 5273 (class 0 OID 0)
-- Dependencies: 260
-- Name: event_print_materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_print_materials_id_seq', 1, false);


--
-- TOC entry 5274 (class 0 OID 0)
-- Dependencies: 234
-- Name: event_reference_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_reference_id_seq', 1, false);


--
-- TOC entry 5275 (class 0 OID 0)
-- Dependencies: 254
-- Name: event_timeline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_timeline_id_seq', 1, false);


--
-- TOC entry 5276 (class 0 OID 0)
-- Dependencies: 248
-- Name: events_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_media_id_seq', 1, false);


--
-- TOC entry 5277 (class 0 OID 0)
-- Dependencies: 242
-- Name: events_passports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_passports_id_seq', 20, true);


--
-- TOC entry 5278 (class 0 OID 0)
-- Dependencies: 231
-- Name: events_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_status_id_seq', 1, false);


--
-- TOC entry 5279 (class 0 OID 0)
-- Dependencies: 250
-- Name: events_youth_policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_youth_policies_id_seq', 1, false);


--
-- TOC entry 5280 (class 0 OID 0)
-- Dependencies: 219
-- Name: faculties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faculties_id_seq', 1, false);


--
-- TOC entry 5281 (class 0 OID 0)
-- Dependencies: 229
-- Name: formats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.formats_id_seq', 3, true);


--
-- TOC entry 5282 (class 0 OID 0)
-- Dependencies: 221
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_id_seq', 1, false);


--
-- TOC entry 5283 (class 0 OID 0)
-- Dependencies: 240
-- Name: members_communities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.members_communities_id_seq', 5, true);


--
-- TOC entry 5284 (class 0 OID 0)
-- Dependencies: 252
-- Name: members_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.members_roles_id_seq', 3, true);


--
-- TOC entry 5285 (class 0 OID 0)
-- Dependencies: 246
-- Name: organizers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.organizers_id_seq', 1, false);


--
-- TOC entry 5286 (class 0 OID 0)
-- Dependencies: 244
-- Name: participations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.participations_id_seq', 1, false);


--
-- TOC entry 5287 (class 0 OID 0)
-- Dependencies: 236
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 13, true);


--
-- TOC entry 5288 (class 0 OID 0)
-- Dependencies: 225
-- Name: youth_policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.youth_policies_id_seq', 1, false);


--
-- TOC entry 5010 (class 2606 OID 16539)
-- Name: communities communities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communities
    ADD CONSTRAINT communities_pkey PRIMARY KEY (id);


--
-- TOC entry 4990 (class 2606 OID 16436)
-- Name: community_roles community_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_roles
    ADD CONSTRAINT community_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5030 (class 2606 OID 16828)
-- Name: event_budget event_budget_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_budget
    ADD CONSTRAINT event_budget_pkey PRIMARY KEY (id);


--
-- TOC entry 4994 (class 2606 OID 16456)
-- Name: event_levels event_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_levels
    ADD CONSTRAINT event_levels_pkey PRIMARY KEY (id);


--
-- TOC entry 5028 (class 2606 OID 16808)
-- Name: event_mto event_mto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_mto
    ADD CONSTRAINT event_mto_pkey PRIMARY KEY (id);


--
-- TOC entry 5032 (class 2606 OID 16850)
-- Name: event_print_materials event_print_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_print_materials
    ADD CONSTRAINT event_print_materials_pkey PRIMARY KEY (id);


--
-- TOC entry 5002 (class 2606 OID 16497)
-- Name: event_reference event_reference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_reference
    ADD CONSTRAINT event_reference_pkey PRIMARY KEY (id);


--
-- TOC entry 5000 (class 2606 OID 16485)
-- Name: event_reference_type event_reference_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_reference_type
    ADD CONSTRAINT event_reference_type_pkey PRIMARY KEY (name);


--
-- TOC entry 5026 (class 2606 OID 16787)
-- Name: event_timeline event_timeline_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_timeline
    ADD CONSTRAINT event_timeline_pkey PRIMARY KEY (id);


--
-- TOC entry 5020 (class 2606 OID 16665)
-- Name: events_media events_media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_media
    ADD CONSTRAINT events_media_pkey PRIMARY KEY (id);


--
-- TOC entry 5014 (class 2606 OID 16584)
-- Name: events_passports events_passports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_pkey PRIMARY KEY (id);


--
-- TOC entry 4998 (class 2606 OID 16477)
-- Name: events_status events_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_status
    ADD CONSTRAINT events_status_pkey PRIMARY KEY (id);


--
-- TOC entry 5022 (class 2606 OID 16680)
-- Name: events_youth_policies events_youth_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_youth_policies
    ADD CONSTRAINT events_youth_policies_pkey PRIMARY KEY (id);


--
-- TOC entry 4986 (class 2606 OID 16399)
-- Name: faculties faculties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT faculties_pkey PRIMARY KEY (id);


--
-- TOC entry 4996 (class 2606 OID 16466)
-- Name: formats formats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formats
    ADD CONSTRAINT formats_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 16410)
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- TOC entry 5012 (class 2606 OID 16550)
-- Name: members_communities members_communities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members_communities
    ADD CONSTRAINT members_communities_pkey PRIMARY KEY (id);


--
-- TOC entry 5024 (class 2606 OID 16773)
-- Name: members_roles members_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members_roles
    ADD CONSTRAINT members_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5018 (class 2606 OID 16644)
-- Name: organizers organizers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizers
    ADD CONSTRAINT organizers_pkey PRIMARY KEY (id);


--
-- TOC entry 5016 (class 2606 OID 16624)
-- Name: participations participations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_pkey PRIMARY KEY (id);


--
-- TOC entry 5004 (class 2606 OID 16715)
-- Name: users unique_auth_uid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_auth_uid UNIQUE (auth_uid);


--
-- TOC entry 5006 (class 2606 OID 16521)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5008 (class 2606 OID 16695)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4992 (class 2606 OID 16446)
-- Name: youth_policies youth_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.youth_policies
    ADD CONSTRAINT youth_policies_pkey PRIMARY KEY (id);


--
-- TOC entry 5034 (class 2606 OID 16498)
-- Name: event_reference event_reference_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_reference
    ADD CONSTRAINT event_reference_type_fkey FOREIGN KEY (type) REFERENCES public.event_reference_type(name);


--
-- TOC entry 5048 (class 2606 OID 16666)
-- Name: events_media events_media_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_media
    ADD CONSTRAINT events_media_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events_passports(id);


--
-- TOC entry 5038 (class 2606 OID 16605)
-- Name: events_passports events_passports_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id);


--
-- TOC entry 5039 (class 2606 OID 16595)
-- Name: events_passports events_passports_community_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_community_role_id_fkey FOREIGN KEY (community_role_id) REFERENCES public.community_roles(id);


--
-- TOC entry 5040 (class 2606 OID 16590)
-- Name: events_passports events_passports_event_level_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_event_level_fkey FOREIGN KEY (event_level) REFERENCES public.event_levels(id);


--
-- TOC entry 5041 (class 2606 OID 16585)
-- Name: events_passports events_passports_format_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_format_id_fkey FOREIGN KEY (format_id) REFERENCES public.formats(id);


--
-- TOC entry 5042 (class 2606 OID 16610)
-- Name: events_passports events_passports_responsible_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_responsible_fkey FOREIGN KEY (responsible) REFERENCES public.members_communities(id);


--
-- TOC entry 5043 (class 2606 OID 16600)
-- Name: events_passports events_passports_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_passports
    ADD CONSTRAINT events_passports_status_fkey FOREIGN KEY (status) REFERENCES public.events_status(id);


--
-- TOC entry 5049 (class 2606 OID 16681)
-- Name: events_youth_policies events_youth_policies_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_youth_policies
    ADD CONSTRAINT events_youth_policies_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events_passports(id);


--
-- TOC entry 5050 (class 2606 OID 16686)
-- Name: events_youth_policies events_youth_policies_yonth_politic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_youth_policies
    ADD CONSTRAINT events_youth_policies_yonth_politic_id_fkey FOREIGN KEY (yonth_politic_id) REFERENCES public.event_reference(id);


--
-- TOC entry 5054 (class 2606 OID 16829)
-- Name: event_budget fk_budget_event; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_budget
    ADD CONSTRAINT fk_budget_event FOREIGN KEY (event_id) REFERENCES public.events_passports(id) ON DELETE CASCADE;


--
-- TOC entry 5053 (class 2606 OID 16809)
-- Name: event_mto fk_mto_event; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_mto
    ADD CONSTRAINT fk_mto_event FOREIGN KEY (event_id) REFERENCES public.events_passports(id) ON DELETE CASCADE;


--
-- TOC entry 5055 (class 2606 OID 16851)
-- Name: event_print_materials fk_print_event; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_print_materials
    ADD CONSTRAINT fk_print_event FOREIGN KEY (event_id) REFERENCES public.events_passports(id) ON DELETE CASCADE;


--
-- TOC entry 5051 (class 2606 OID 16788)
-- Name: event_timeline fk_timeline_event; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_timeline
    ADD CONSTRAINT fk_timeline_event FOREIGN KEY (event_id) REFERENCES public.events_passports(id) ON DELETE CASCADE;


--
-- TOC entry 5052 (class 2606 OID 16793)
-- Name: event_timeline fk_timeline_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_timeline
    ADD CONSTRAINT fk_timeline_user FOREIGN KEY (user_id) REFERENCES public.members_communities(id) ON DELETE CASCADE;


--
-- TOC entry 5033 (class 2606 OID 16411)
-- Name: groups groups_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculties(id);


--
-- TOC entry 5036 (class 2606 OID 16556)
-- Name: members_communities members_communities_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members_communities
    ADD CONSTRAINT members_communities_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id);


--
-- TOC entry 5037 (class 2606 OID 16697)
-- Name: members_communities members_communities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members_communities
    ADD CONSTRAINT members_communities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5046 (class 2606 OID 16645)
-- Name: organizers organizers_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizers
    ADD CONSTRAINT organizers_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events_passports(id);


--
-- TOC entry 5047 (class 2606 OID 16650)
-- Name: organizers organizers_members_communitiy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizers
    ADD CONSTRAINT organizers_members_communitiy_id_fkey FOREIGN KEY (members_communitiy_id) REFERENCES public.members_communities(id);


--
-- TOC entry 5044 (class 2606 OID 16625)
-- Name: participations participations_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events_passports(id);


--
-- TOC entry 5045 (class 2606 OID 16702)
-- Name: participations participations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5035 (class 2606 OID 16522)
-- Name: users users_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


-- Completed on 2026-03-09 13:35:10

--
-- PostgreSQL database dump complete
--

\unrestrict r22iYZRM0fiJLk6lEX5hbnI4gRbXI02Ncfp3RL7MREvW9OvBoXb117BYgJqNbCp

