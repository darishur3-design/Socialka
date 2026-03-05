--
-- PostgreSQL database cluster dump
--

-- Started on 2026-03-02 19:41:56

\restrict XY03GdWdkLW3FAqTWegzoX5U4tdqYfsA53RLBQAtRMWpfNTZVII9HVaAaNlbk0e

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:H5zNSa0KSZ9qHYBkS/j26w==$EmfbvFx3tndHzfwZq/lzBLk+Z5OhrrXtT3rL9Hj9chs=:kIty7xdzjp+c7Dn4q5SxUimL5KG2YjKk47GsfYmST4w=';

--
-- User Configurations
--








\unrestrict XY03GdWdkLW3FAqTWegzoX5U4tdqYfsA53RLBQAtRMWpfNTZVII9HVaAaNlbk0e

-- Completed on 2026-03-02 19:41:56

--
-- PostgreSQL database cluster dump complete
--

