-- Table: public.calendars

-- DROP TABLE public.calendars;

CREATE TABLE public.calendars
(
    id integer NOT NULL,
    calendar_id text COLLATE pg_catalog."default" NOT NULL,
    kiosk_id macaddr,
    CONSTRAINT calendars_pkey PRIMARY KEY (id),
    CONSTRAINT unique_calendar_id UNIQUE (calendar_id),
    CONSTRAINT fk_kiosk FOREIGN KEY (kiosk_id)
        REFERENCES public.kiosks (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.calendars
    OWNER to ravawvkonfirwo;