drop table if exists exam_scores;
drop table if exists students;
drop table if exists schools;
drop table if exists provinces;
drop table if exists subjects;
drop table if exists special_contributions;

create table provinces
(
    id     int auto_increment
        primary key,
    name   text                                                            not null,
    region enum ('Central', 'North', 'Northeast', 'West', 'East', 'South') not null
);

create table schools
(
    id       int auto_increment
        primary key,
    name     text not null,
    province int  not null,
    constraint schools_provinces_id_fk
        foreign key (province) references provinces (id)
);

create table students
(
    id     int auto_increment
        primary key,
    name   text not null,
    school int  not null,
    constraint students_schools_id_fk
        foreign key (school) references schools (id)
);

create table subjects
(
    id   int auto_increment
        primary key,
    name text not null
);

create table exam_scores
(
    student int not null,
    subject int not null,
    score   int not null,
    primary key (student, subject),
    constraint exam_scores_students_id_fk
        foreign key (student) references students (id),
    constraint exam_scores_subjects_id_fk
        foreign key (subject) references subjects (id),
	constraint `exam_scores score between 0 and 100`
        check ((`score` >= 0) and (`score` <= 100))
);

create table special_contributions
(
    id         int auto_increment
        primary key,
    donor_name text not null,
    amount     int  not null,
    purpose    text null,
    constraint `special_contributions amount non-negative`
        check (`amount` >= 0)
);

insert into subjects (id, name)
values  (1, 'ภาษาไทย'),
        (2, 'ภาษาอังกฤษ'),
        (3, 'คณิตศาสตร์'),
        (4, 'สังคมศึกษา'),
        (5, 'พลังงานและออร่า'),
        (6, 'ธาตุศาสตร์'),
        (7, 'เวทนิเวศวิทยา'),
        (8, 'ตรรกะเวทมนตร์');

insert into provinces (id, name, region)
values  (1, 'กรุงเทพมหานคร', 'Central'),
        (2, 'สมุทรปราการ', 'Central'),
        (3, 'นนทบุรี', 'Central'),
        (4, 'ปทุมธานี', 'Central'),
        (5, 'พระนครศรีอยุธยา', 'Central'),
        (6, 'อ่างทอง', 'Central'),
        (7, 'ลพบุรี', 'Central'),
        (8, 'สิงห์บุรี', 'Central'),
        (9, 'ชัยนาท', 'Central'),
        (10, 'สระบุรี', 'Central'),
        (11, 'ชลบุรี', 'East'),
        (12, 'ระยอง', 'East'),
        (13, 'จันทบุรี', 'East'),
        (14, 'ตราด', 'East'),
        (15, 'ฉะเชิงเทรา', 'East'),
        (16, 'ปราจีนบุรี', 'East'),
        (17, 'นครนายก', 'Central'),
        (18, 'สระแก้ว', 'East'),
        (19, 'นครราชสีมา', 'Northeast'),
        (20, 'บุรีรัมย์', 'Northeast'),
        (21, 'สุรินทร์', 'Northeast'),
        (22, 'ศรีสะเกษ', 'Northeast'),
        (23, 'อุบลราชธานี', 'Northeast'),
        (24, 'ยโสธร', 'Northeast'),
        (25, 'ชัยภูมิ', 'Northeast'),
        (26, 'อำนาจเจริญ', 'Northeast'),
        (27, 'หนองบัวลำภู', 'Northeast'),
        (28, 'ขอนแก่น', 'Northeast'),
        (29, 'อุดรธานี', 'Northeast'),
        (30, 'เลย', 'Northeast'),
        (31, 'หนองคาย', 'Northeast'),
        (32, 'มหาสารคาม', 'Northeast'),
        (33, 'ร้อยเอ็ด', 'Northeast'),
        (34, 'กาฬสินธุ์', 'Northeast'),
        (35, 'สกลนคร', 'Northeast'),
        (36, 'นครพนม', 'Northeast'),
        (37, 'มุกดาหาร', 'Northeast'),
        (38, 'เชียงใหม่', 'North'),
        (39, 'ลำพูน', 'North'),
        (40, 'ลำปาง', 'North'),
        (41, 'อุตรดิตถ์', 'North'),
        (42, 'แพร่', 'North'),
        (43, 'น่าน', 'North'),
        (44, 'พะเยา', 'North'),
        (45, 'เชียงราย', 'North'),
        (46, 'แม่ฮ่องสอน', 'North'),
        (47, 'นครสวรรค์', 'Central'),
        (48, 'อุทัยธานี', 'Central'),
        (49, 'กำแพงเพชร', 'Central'),
        (50, 'ตาก', 'West'),
        (51, 'สุโขทัย', 'Central'),
        (52, 'พิษณุโลก', 'Central'),
        (53, 'พิจิตร', 'Central'),
        (54, 'เพชรบูรณ์', 'Central'),
        (55, 'ราชบุรี', 'West'),
        (56, 'กาญจนบุรี', 'West'),
        (57, 'สุพรรณบุรี', 'Central'),
        (58, 'นครปฐม', 'Central'),
        (59, 'สมุทรสาคร', 'Central'),
        (60, 'สมุทรสงคราม', 'Central'),
        (61, 'เพชรบุรี', 'West'),
        (62, 'ประจวบคีรีขันธ์', 'West'),
        (63, 'นครศรีธรรมราช', 'South'),
        (64, 'กระบี่', 'South'),
        (65, 'พังงา', 'South'),
        (66, 'ภูเก็ต', 'South'),
        (67, 'สุราษฎร์ธานี', 'South'),
        (68, 'ระนอง', 'South'),
        (69, 'ชุมพร', 'South'),
        (70, 'สงขลา', 'South'),
        (71, 'สตูล', 'South'),
        (72, 'ตรัง', 'South'),
        (73, 'พัทลุง', 'South'),
        (74, 'ปัตตานี', 'South'),
        (75, 'ยะลา', 'South'),
        (76, 'นราธิวาส', 'South'),
        (77, 'บึงกาฬ', 'Northeast');
