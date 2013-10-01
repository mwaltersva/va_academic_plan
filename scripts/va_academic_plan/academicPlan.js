/*
 *  Build an object of the form for easier access later
 */
var APForm = {
    initiation_date: $j('#intiation_date'),
    graduation_year: $j('#graduation_year'),
    review_date_7: $j('#review_date_7'),
    review_date_8: $j('#review_date_8'),
    review_date_9: $j('#review_date_9'),
    review_date_10: $j('#review_date_10'),
    review_date_11: $j('#review_date_11'),
    review_date_12: $j('#review_date_12'),
    career_goal: $j('career_goal'),
    occupation_of_interest: $j('occupation_of_interest'),
    career_cluster: $j('#career_cluster'),
    career_cluster_code: $j('#career_cluster_code'),
    current_state_career_family_code: $j('#current_state_career_family_code'),
    va_cte_career_family_code: $j('#va_cte_career_family_code'),
    copy_career_cluster_to_state: $j('#copy_career_cluster_to_state'),
    career_pathway: $j('#career_pathway'),
    va_cte_career_pathway: $j('#va_cte_career_pathway'),
    career_assessment: $j('#career_assessment'),
    career_assessment_date: $j('#career_assessment_date'),
    career_assessment_result: $j('#career_assessment_result'),
    career_assessment_description: $j('#career_assessment_description'),
    industry_certifications: $j('#industry_certifications'),
    diploma_goal: $j('#diploma_goal'),
    early_college_scholar: $j('#early_college_scholar'),
    commonwealth_scholar: $j('#commonwealth_scholar'),
    diploma_seal_checkboxes: [$j('#ds_governors'),
                    $j('#ds_board_of_education'),
                    $j('#ds_career_and_technical_education'),
                    $j('#ds_advanced_mathematics_and_technology'),
                    $j('#ds_seal_for_excellence_in_civics_education')],
    diploma_seal_code: $j('#diploma_seal_code'),
    diploma_seal_copy_to_state_field: $j('#ds_copy_to_state_field'),
    current_state_diploma_seal_code: $j('#current_state_diploma_seal_code'),
    va_diploma_seal: $j('#va_diploma_seal'),
    sat_goal: $j('#sat_goal'),
    act_goal: $j('#act_goal'),
    college: $j('#college'),
    military: $j('#military'),
    program_of_study: $j('#program_of_study')
};

function update_diploma_seal_checkboxes(code) {
    /*
     *  Updates the diploma seal checkboxes based on the diploma seal code.
     */
    if (code) {
        for(i=0;i<=code.length;i++) {
            $j.each(APForm.diploma_seal_checkboxes, function() {
                if (code[i] == $j(this).data("statecode")) {
                    $j(this).prop("checked", true);
                }
            });
        }
    }
};

function update_diploma_seal_field() {
    /*
     *  Updates the diploma seal code based on the checkbox values.
     */
    APForm.diploma_seal_code.val("");
    var code = "";
    $j.each(APForm.diploma_seal_checkboxes, function() {
        if ($j(this).prop("checked") === true) {
            code = code.concat($j(this).data("statecode"));
        }
    });
    if (code.length > 0) {
        APForm.diploma_seal_code.val(code);
    }
}

function update_state_diploma_seal_code_display() {
    /*
     * Updates the displayed state diploma seal code
     */
    APForm.current_state_diploma_seal_code.html(APForm.va_diploma_seal.val());
}

function update_state_diploma_seal_code() {
    /*
     * Updates the value for the state diploma seal code
     */
    APForm.va_diploma_seal.val(APForm.diploma_seal_code.val());
    update_state_diploma_seal_code_display();
}

function update_career_cluster_options() {
    /*
     * Updates the available career cluster options.
     */
    APForm.career_cluster.empty();
    var option = "<option value=\"\">Select a cluster...</option>";
    APForm.career_cluster.append(option);
    $j.each(CTECareerClusters, function() {
        option = "<option value=\"" + this["state_code"] + "\">" + this["description"] + "</option>";
        APForm.career_cluster.append(option);
    });
    if (APForm.career_cluster_code.val()) {
        APForm.career_cluster.val(APForm.career_cluster_code.val());
    } else {
        if (APForm.va_cte_career_family_code.val()) {
            APForm.career_cluster.val(APForm.va_cte_career_family_code.val());
            update_career_cluster_code();
        }
    }
}

function update_career_cluster_code() {
    /*
     * Updates the career_cluster_code field
     */
    APForm.career_cluster_code.val(APForm.career_cluster.val());
}

function update_state_career_cluster_display() {
    APForm.current_state_career_family_code.empty();
    APForm.current_state_career_family_code.append(APForm.va_cte_career_family_code.val());
}

function update_state_career_cluster() {
    /*
     * Updates the state career cluster code
     */
    APForm.va_cte_career_family_code.val(APForm.career_cluster_code.val());
    update_state_career_cluster_display();
}

function update_career_pathway_options() {
    /*
     * Updates the available career pathway options based on the selected career cluster
     */
    cluster = APForm.career_cluster.val();
    if (cluster) {
        APForm.career_pathway.empty();
        var option = "<option value=\"\">Select a Pathway...</option>";
        APForm.career_pathway.append(option);
        $j.each(CTECareerClusters, function() {
            if (this.state_code == cluster) {
                $j.each(this.career_pathways, function() {
                    option = "<option value=\"" + this.state_code + "\">" + this.description + "</option>";
                    APForm.career_pathway.append(option);
                });
            }
        });
        if (APForm.va_cte_career_pathway.val()) {
            APForm.career_pathway.val(APForm.va_cte_career_pathway.val());
        }
    } else {
        APForm.career_pathway.empty();
    }
}

function update_state_career_pathway() {
    /*
     * Updates the state career pathway code.
     */
    APForm.va_cte_career_pathway.val(APForm.career_pathway.val());
}

function create_program_of_study_table() {
    /*
     * Creates the program of study table outline and inputs.
     */
    var grade_levels = [];
    $j.each(ProgramOfStudy.requirements, function() {
        if (this.grade_levels !== null) {
            $j.each(this.grade_levels, function(index, value) {
                if ($j.inArray(value, grade_levels) === -1) {
                    grade_levels.push(value);
                }
            });
        }
    });
    grade_levels.sort(function(a,b) { return a-b; });
    $j('#pos_header').append("<th>Subject/Req.</th>");
    $j.each(grade_levels, function(index, value){
        cell = "<th data-grade_level=\"" + value + "\">" + value +
            "<br><a class=\"select_all\" data-grade_level=\""+value+"\" title\"Add\">Select All</a></th>";
        $j('#pos_header').append(cell);
    });
    $j.each(ProgramOfStudy.requirements, function() {
        var i = 0;
        var req = this;
        var num_rows = $j('#pos_table tr').length;
        if (num_rows%2 === 0) {
            var row_class = "evenRow";
        } else {
            var row_class = "oddRow";
        }
        if (req.grade_levels) {
            var table_row = "<tr class=\"" + row_class + "\" data-subject=\"" + this.name + "\"><td class=\"bold\" data-row_label=\"true\">"+ req.name + "</td>";
            var subject = this.name;
            $j.each(grade_levels, function(index, value) {
                if ($j.inArray(value, req.grade_levels) !== -1) {
                    table_row += "<td data-grade_level=\"" + value + "\" ";
                    if (i > 0) {
                        table_row += "colspan=\"" + i + "\">";
                    } else {
                        table_row += ">";
                    }
                    table_row += "<input type=\"text\" data-subject=\"" + subject + "\" data-grade_level=\"" + value + "\" class=\"pos_course_input\"></td>";
                } else {
                        i++;
                }
            });
        } else {
            var table_row = "<tr class=\"" + row_class + "\" data-subject=\"" + this.name + "\"><td class=\"bold\" data-row_label=\"true\">"+ req.name;
            table_row += "<td colspan=\"" + grade_levels.length + "\"><input type=\"text\" data-subject=\"" + this.name + "\" class=\"pos_course_input\"></td>";
        }
        table_row += "</tr>";
        $j('#pos_table').append(table_row);
        $j('input.pos_course_input').each(function() {
            $j(this).css("display","none");
            $j(this).autocomplete({
                source: function(request,response) {
                    $j.getJSON("course_information.json", {
                        term: request.term
                    }, response);
                },
                search: function () {
                    var term = this.value;
                    if (term.length < 2) {
                        return false;
                    }
                },
                focus: function(event, ui) {
                    return false;
                },
                select: function(event, ui) {
                    var course = {
                        course_number: ui.item.value,
                        subject: $j(this).data("subject")
                    };
                    if($j(this).data("grade_level") !== undefined) {
                        course.grade_level = $j(this).data("grade_level");
                    } else {
                        course.grade_level = null;
                    }
                    this.value = "";
                    ProgramOfStudy.schedule.push(course);
                    update_program_of_study_table();
                    return false;
                },
                close: function(event, ui) {
                    return false;
                }
            });
        });
    });
}

function update_program_of_study_table() {
    /*
     * Updates the program of study table with courses.
     */
    $j('#pos_table tr td[data-row_label!="true"]').children("div").remove();
    if (ProgramOfStudy.schedule.length > 0) {
        $j.each(ProgramOfStudy.schedule, function() {
            var subject = this.subject;
            var grade_level = this.grade_level;
            var course_number = this.course_number;
            $j.getJSON("course_information.json",{single_course: 1,course_number: this.course_number,studentid: window.ps_curstudid}).done(function(data) {
                table_row = $j('#pos_table tr[data-subject="'+ subject + '"]');
                if (grade_level) {
                    row_cell = table_row.children('td[data-grade_level="'+ grade_level + '"]');
                } else {
                    row_cell = table_row.children('td[data-row_label!="true"]');
                }
                course_display = "<div id=\"" + data.course_number + "\"><input type=\"checkbox\" class=\"course_checkbox\" data-grade_level=\"" + grade_level + "\" data-subject=\"" + subject +
                    "\" data-course_number=\"" + data.course_number + "\" id=\"" + grade_level+subject+data.course_number + "\"><label style=\"color: " + data.status + "\" for=\"" +
                    grade_level+subject+data.course_number + "\">" + data.course_number + " - " + data.course_name + "</label></div>";
                row_cell.append(course_display);
            });
        });
    }
}

function select_all(grade_level) {
    /*
     * Select all courses entered for the column
     */
    $j('#pos_table input[type="checkbox"][data-grade_level="'+grade_level+'"]').each(function() {
        if ($j(this).is(':checked')) {
            $j(this).attr("checked", false);
        } else {
            $j(this).attr("checked", true);
        }
    });
}

function remove_selected() {
    /*
     * Removes the selected courses from the student's program of study.
     */
    $j('#pos_table input.course_checkbox').each(function() {
        if ($j(this).is(':checked')) {
            subject = $j(this).attr("data-subject");
            grade_level = $j(this).attr("data-grade_level");
            course_number = $j(this).attr("data-course_number");
            $j.map(ProgramOfStudy.schedule, function(obj, index) {
               if (String(obj.course_number) === course_number && String(obj.subject) === subject && String(obj.grade_level) === grade_level) {
                   index_to_remove = index;
               } 
            });
            ProgramOfStudy.schedule.splice(index_to_remove,1);
        }
    });
    update_program_of_study_table();
}

function group_action(action) {
    /*
     *  The group action function.
     */
    if (action === "remove") {
        remove_selected();
    }
}

/* I don't think we need these anymore.
function split(val) {
    return val.split( /,\s*\/ );
}

function extractLast(term) {
    return split(term).pop();
} */
   
    function update_POS_field() {
        /*
     * Converts the program of study schedule array into a string and puts it into a hidden field.
     */
    APForm.program_of_study.empty();
    APForm.program_of_study.val(JSON.stringify(ProgramOfStudy.schedule));
}

function update_schedule_object() {
    /*
     * Loads the program of study schedule array from a hidden field into the ProgramOfStudy.schedule array.
     */
    ProgramOfStudy.schedule = $j.parseJSON(APForm.program_of_study.val());
}

$j(function() {
    var input_mode = false; //Used to determine the display state of the schedule inputs
     
    update_diploma_seal_checkboxes(APForm.diploma_seal_code.val());

    $j(APForm.diploma_seal_checkboxes).each(function() {
        $j(this).change(function() {
            update_diploma_seal_field();
        });
    });
    $j.getJSON("career_pathways.json").done(function(data) {
        CTECareerClusters = data;
        update_career_cluster_options();
        update_career_pathway_options();
    });
    
    $j.getJSON("program_of_study.json").done(function(data) {
        ProgramOfStudy = data;
        create_program_of_study_table();
        if (APForm.program_of_study.val().length > 0) {
            update_schedule_object();
        } else {
            ProgramOfStudy.schedule = [];
        }
        update_program_of_study_table();
        
        $j('a[class="select_all"]').each(function(){
            $j(this).click(function() {
                select_all($j(this).attr("data-grade_level"));
            });
        });
        
        $j('a[id="add_to_grade_level"]').each(function() {
            $j(this).css("visibility","visible");
            $j(this).click(function() {
                show_add_courses_dialog($j(this).data("grade_level"),null);
            });
        });
        
        $j('a[id="add_to_non_grade_level"]').each(function() {
            $j(this).click(function() {
                show_add_courses_dialog(null, $j(this).data("subject"));
            });
        });
    });
    
    update_state_career_cluster_display();
    
    $j('#add_courses_button').click(function() {
        add_courses();
        $j('#add_courses_to_grade_level_div').dialog("close");
    });
    APForm.career_cluster.change(function(){
       update_career_cluster_code();
       update_career_pathway_options();
       update_state_career_pathway();
    });
    
    APForm.copy_career_cluster_to_state.click(function() {
        update_state_career_cluster();
    });
    
    APForm.career_pathway.change(function() {
        update_state_career_pathway();
    });
    
    $j('#ds_copy_to_state_field').click(function() {
        update_state_diploma_seal_code();
        update_state_diploma_seal_code_display();
    });
    
    $j("#group_action").click(function(){
        group_action($j('#selected_action').val());
        $j('#selected_action').val("");
    });
    
    $j('form').submit(function() {
       update_POS_field();
       return true;
    });
    $j('#show_inputs').click(function() {
        if (input_mode === false) {
            $j('input.pos_course_input').each(function() {
                $j(this).css("display", "inline");
            });
            input_mode = true;
        } else {
            $j('input.pos_course_input').each(function() {
                $j(this).css("display", "none");
            });
            input_mode=false;
        }
    });
});