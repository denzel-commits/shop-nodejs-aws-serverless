--
-- PostgreSQL database dump
--

-- Products table data

INSERT INTO public.products (id, title, description, price) VALUES ('1bffb836-213e-43ff-bcd1-ebae14e37210', 'MARSHALL Emberton', 'Short Product Description', 200);
INSERT INTO public.products (id, title, description, price) VALUES ('feeba11a-fe71-45d1-87d1-2d988d778a53', 'Sony SRS-XB12', 'Short Product Description', 50);
INSERT INTO public.products (id, title, description, price) VALUES ('8e662468-583f-4acf-b752-054dde14f270', 'Bose SoundLink Color II', 'Portable Bluetooth, Wireless Speaker with Microphone- Soft Black', 23);
INSERT INTO public.products (id, title, description, price) VALUES ('534b4933-9e95-4a53-abc9-bdf91151cee4', 'JBL Charge 3', 'Waterproof Portable Bluetooth Speaker (Black)', 129);
INSERT INTO public.products (id, title, description, price) VALUES ('47b8310c-68cf-4432-b3ca-04173e7f7422', 'JBL Clip 3', 'Short Product Description', 50);
INSERT INTO public.products (id, title, description, price) VALUES ('bdb7f1e4-9e7e-4973-9a01-3d0344d1abf7', 'JBL FLIP 4', 'Short Product Description', 15);
INSERT INTO public.products (id, title, description, price) VALUES ('29218b3d-b6f9-4b95-866d-669d991f6559', 'Sony SRS-XP700', 'Short Product Description', 448);
INSERT INTO public.products (id, title, description, price) VALUES ('77c2fae4-d616-433e-845b-58259cf62529', 'JBL FLIP 5', 'Short Product Description', 119);
INSERT INTO public.products (id, title, description, price) VALUES ('e944bc24-5770-4345-b43e-f3c1b82e9dbe', 'JBL Charge 4', 'Waterproof Portable Bluetooth Speaker - Black', 149);
INSERT INTO public.products (id, title, description, price) VALUES ('9cb9fce5-1dd3-4098-a8f8-56cb5ef02fdf', 'JBL BassPro Go', 'Short Product Description', 549);
INSERT INTO public.products (id, title, description, price) VALUES ('e8ceab4e-d8db-4887-a794-97b553b41284', 'Sony SRS-XB33 EXTRA BASS', 'Short Product Description', 148);
INSERT INTO public.products (id, title, description, price) VALUES ('d7953495-207c-4a23-90b4-e3bcd66cff51', 'JBL CHARGE 5', 'Short Product Description', 179);
INSERT INTO public.products (id, title, description, price) VALUES ('d2ffaa80-57f6-4ce4-995a-50c1e4665490', 'Sony SRS-XG500', 'Short Product Description', 448);
INSERT INTO public.products (id, title, description, price) VALUES ('0f81f8e1-834e-473b-9878-efdf9634fea0', 'Bose SoundLink Revolve+', 'Short Product Description', 299);
INSERT INTO public.products (id, title, description, price) VALUES ('5102b9cd-5e19-4dcf-bd2f-d8da13c749eb', 'Sony SRS-XB13 Extra BASS', 'Short Product Description', 58);


-- Stocks table data

INSERT INTO public.stocks (product_id, count) VALUES ('1bffb836-213e-43ff-bcd1-ebae14e37210', 20);
INSERT INTO public.stocks (product_id, count) VALUES ('feeba11a-fe71-45d1-87d1-2d988d778a53', 50);
INSERT INTO public.stocks (product_id, count) VALUES ('8e662468-583f-4acf-b752-054dde14f270', 23);
INSERT INTO public.stocks (product_id, count) VALUES ('534b4933-9e95-4a53-abc9-bdf91151cee4', 12);
INSERT INTO public.stocks (product_id, count) VALUES ('47b8310c-68cf-4432-b3ca-04173e7f7422', 50);
INSERT INTO public.stocks (product_id, count) VALUES ('bdb7f1e4-9e7e-4973-9a01-3d0344d1abf7', 15);
INSERT INTO public.stocks (product_id, count) VALUES ('29218b3d-b6f9-4b95-866d-669d991f6559', 40);
INSERT INTO public.stocks (product_id, count) VALUES ('77c2fae4-d616-433e-845b-58259cf62529', 15);
INSERT INTO public.stocks (product_id, count) VALUES ('e944bc24-5770-4345-b43e-f3c1b82e9dbe', 19);
INSERT INTO public.stocks (product_id, count) VALUES ('9cb9fce5-1dd3-4098-a8f8-56cb5ef02fdf', 50);
INSERT INTO public.stocks (product_id, count) VALUES ('e8ceab4e-d8db-4887-a794-97b553b41284', 100);
INSERT INTO public.stocks (product_id, count) VALUES ('d7953495-207c-4a23-90b4-e3bcd66cff51', 70);
INSERT INTO public.stocks (product_id, count) VALUES ('d2ffaa80-57f6-4ce4-995a-50c1e4665490', 48);
INSERT INTO public.stocks (product_id, count) VALUES ('0f81f8e1-834e-473b-9878-efdf9634fea0', 34);
INSERT INTO public.stocks (product_id, count) VALUES ('5102b9cd-5e19-4dcf-bd2f-d8da13c749eb', 58);
