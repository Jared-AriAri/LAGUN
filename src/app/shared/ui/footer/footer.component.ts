import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "lagun-footer",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./footer.component.html",
})
export class FooterComponent {}
