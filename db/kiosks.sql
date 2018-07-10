CREATE TABLE public.kiosks
(
    id macaddr NOT NULL,
    label character varying(25),
    last_ip_address cidr,
    CONSTRAINT pk_id PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.kiosks
    OWNER to ravawvkonfirwo;