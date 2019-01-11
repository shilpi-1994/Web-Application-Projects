SELECT * FROM messbox.register;

CREATE TABLE `register` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `USERNAME` varchar(45) NOT NULL,
  `FIRST_NAME` varchar(45) NOT NULL,
  `LAST_NAME` varchar(45) NOT NULL,
  `EMAIL` varchar(45) NOT NULL,
  `PHONE` varchar(20) NOT NULL,
  `PASSWORD` varchar(45) NOT NULL,
  `PROFILE_PIC` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ;



