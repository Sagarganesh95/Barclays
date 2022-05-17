# NOC App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://noc.adapptonline.com:80/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## noc-1.17

updated with new Formula as unhealthy check depend on status on collection  
updated with excel export with relavent fields on table view  
updated with unhealthy tread with working, notworking and total from date of installed sensors \
1.17 version is resolved some above solutions

## noc-1.18

- BACK Functionality must be added to navigate for the below icon
- Unique ID Sorting issue in table
- Updated with code correction and added loader if internet latency delay in comments on sensors
- HYPERLINK can be removed for STATUS on table view
- updated with new Date range picker with only date selection
- DATE Range is selected but no option to RUN is updated with after selecting from and to date new data refresh occurs
- UI For graph and zoom function need to be changed / improved with new date zoom on trend of unhealthy sensors
- Threshold Filter is deprecated in future versions
- Functionality of the MAIL Box is improved
- ADDED - Mail Scheduler will be Done every week days of early morning 7:00 AM (IST)

## noc-1.18.1

- Api request is optimized relative client by catagorized devices 
- building names in selecting(mat-select) on device based page is optimized. 
- Api For Unhealthy host for mail Scheduler is created at every week days of early morning 7:00 AM (IST);

## noc-1.19

- Api's get Enhancement for Host devices 
    * unhealthy host list
    * host list host shown 3 ways like unhealthy last 30 min , unhealthy last 1 day, unhealthy last 1 week.
- Api's Get Enhancement for Trend of Host devices 
- UI Became for this host devices and became modular so whole page spilit into different module so recycle is possible now


## noc-1.20

- Api's Get updated new Logic for Trend of Host, Desk  and Nova devices so
    * total shown by total sensors of max response time of last 1 month .
    * working sensors shown by sensors max response of every day that greater 12 hours substract time that day and if not satisfy that condition called not working

## noc-1.21

- Api's for host trend has bug and it fix 
- added new loader UI for better view 
- Original shippment data shown and it has UI issue to view and that bug is fix
- Filters are added site based view (Enhancement).
    
## noc-1.25.0

- API's are Login and Sign Up.
- UI for Login and Profile Settings
- User Auth.. For All API's is Completed.
- UI Patch like right Click and Ctrl C and Ctrl V is disabled in Profile Settings

## noc-1.27.0
- updated with unit Testing 

## noc - 1.29.0

- Implement Redis-cache (In-Memory database storage concept) on All NOC API's and data stores in Running server for 10 mins after orginal Aggrigation API's called 



## noc - 1.30.0

- bug fixed on Redis-cache on unhealthy Trend
