CREATE TABLE public.calendars
(
    id integer NOT NULL,
    calendar_id text NOT NULL,
    kiosk_id macaddr,
    PRIMARY KEY (id),
    CONSTRAINT fk_kiosk FOREIGN KEY (kiosk_id)
        REFERENCES public.kiosks (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.calendars
    OWNER to ravawvkonfirwo;