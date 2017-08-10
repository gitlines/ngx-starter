import { OnInit } from '@angular/core';
import { MdSnackBar } from "@angular/material";
import { ToastService } from "../toasts/toast.service";
export declare class ToastSnackbarComponent implements OnInit {
    private toastService;
    snackBar: MdSnackBar;
    private subscription;
    constructor(toastService: ToastService, snackBar: MdSnackBar);
    ngOnInit(): void;
}
